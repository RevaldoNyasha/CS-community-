# Stage 1: Build frontend assets
FROM node:22-alpine AS frontend
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ENV DOCKER_BUILD=true
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
