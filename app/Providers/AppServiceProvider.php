<?php

namespace App\Providers;

use Carbon\CarbonImmutable;
use Google\Cloud\Storage\StorageClient;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;
use League\Flysystem\Filesystem;
use League\Flysystem\FilesystemAdapter as FlysystemAdapter;
use League\Flysystem\FilesystemOperator;
use League\Flysystem\GoogleCloudStorage\GoogleCloudStorageAdapter;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (app()->isProduction() && ! app()->runningUnitTests()) {
            URL::forceScheme('https');
        }

        $this->configureDefaults();

        Storage::extend('gcs', function ($app, array $config) {
            $client = new StorageClient([
                'projectId' => $config['project_id'],
                'keyFile' => $config['key_file'] ?? null,
            ]);

            $bucket = $client->bucket($config['bucket']);
            $adapter = new GoogleCloudStorageAdapter($bucket, $config['root'] ?? '');
            $baseUrl = 'https://storage.googleapis.com/'.($config['bucket'] ?? '');

            return new class(new Filesystem($adapter, $config), $adapter, $config, $baseUrl) extends FilesystemAdapter
            {
                public function __construct(
                    FilesystemOperator $driver,
                    FlysystemAdapter $adapter,
                    array $config,
                    private readonly string $gcsBaseUrl = '',
                ) {
                    parent::__construct($driver, $adapter, $config);
                }

                public function url($path): string
                {
                    return rtrim($this->gcsBaseUrl, '/').'/'.ltrim($path, '/');
                }
            };
        });
    }

    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null
        );
    }
}
