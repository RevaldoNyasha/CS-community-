# Stage 1: Build frontend assets (needs PHP for Wayfinder type generation)
FROM node:22-alpine AS frontend
WORKDIR /app

# Install PHP CLI so Wayfinder can call `php artisan wayfinder:generate`
RUN apk add --no-cache \
    php84 \
    php84-phar \
    php84-json \
    php84-mbstring \
    php84-tokenizer \
    php84-xml \
    php84-xmlwriter \
    php84-dom \
    php84-fileinfo \
    php84-ctype \
    php84-openssl \
    php84-bcmath \
    && ln -sf /usr/bin/php84 /usr/bin/php

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Install PHP dependencies (needed for php artisan to boot)
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-scripts --no-interaction

COPY package*.json ./
RUN npm ci
COPY . .

# Minimal env so Laravel can boot for Wayfinder generation (no real DB needed)
ENV APP_KEY=base64:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa=
ENV APP_ENV=production
ENV DB_CONNECTION=sqlite
ENV DB_DATABASE=:memory:

RUN npm run build

# Stage 2: PHP runtime
FROM php:8.4-fpm-alpine

# System dependencies
RUN apk add --no-cache \
    nginx \
    supervisor \
    libpq-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    zip \
    unzip \
    nodejs \
    npm

# PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install \
        pdo \
        pdo_pgsql \
        pgsql \
        gd \
        zip \
        opcache \
        pcntl \
        bcmath \
        intl

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Install PHP dependencies (production only)
COPY composer.json composer.lock ./
RUN composer install \
    --no-dev \
    --optimize-autoloader \
    --no-scripts \
    --no-interaction

# Copy application source
COPY . .

# Copy built frontend assets and SSR bundle from Stage 1
COPY --from=frontend /app/public/build ./public/build
COPY --from=frontend /app/bootstrap/ssr ./bootstrap/ssr

# Prepare storage directories
RUN mkdir -p \
    storage/app/public \
    storage/framework/cache/data \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache \
    && chown -R www-data:www-data /var/www/html

# Copy Docker runtime configs
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY docker/start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 8080

CMD ["/start.sh"]
