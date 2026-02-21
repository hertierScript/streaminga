# syntax=docker/dockerfile:1
FROM php:8.2-fpm-alpine

# Install system dependencies + PHP extensions
RUN apk add --no-cache \
    git \
    curl \
    zip \
    unzip \
    libzip-dev \
    nodejs \
    npm \
    && docker-php-ext-install pdo_mysql zip pcntl bcmath \
    && docker-php-ext-enable pcntl

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy dependency files first (better caching)
COPY composer.json composer.lock ./

# Install PHP dependencies without running post-install scripts
RUN composer install \
    --no-dev \
    --no-interaction \
    --prefer-dist \
    --optimize-autoloader \
    --no-scripts \
    --no-progress

# Copy the rest of the application
COPY . .

# Install frontend dependencies and build assets
RUN npm ci && npm run build -- --no-progress

# Set proper permissions
RUN chown -R www-data:www-data \
    /var/www/storage \
    /var/www/bootstrap/cache

# Make sure storage/logs is writable
RUN mkdir -p /var/www/storage/logs \
    && chown -R www-data:www-data /var/www/storage/logs

# Expose port (for information only – fpm listens on 9000 internally)
EXPOSE 9000

# Use a simple entrypoint that runs artisan commands safely
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["php-fpm"]



