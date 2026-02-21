FROM php:8.2-apache

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libpq-dev \
    && docker-php-ext-install pdo pdo_mysql pdo_pgsql mbstring exif pcntl bcmath gd

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt-get install -y nodejs

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy package files first for better caching
COPY package.json package-lock.json* ./

# Install Node dependencies
RUN npm ci --production=false

# Copy application files
COPY --chown=www-data:www-data . .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-scripts
RUN composer dump-autoload --optimize

# Set environment variables for production build
ENV VITE_APP_NAME="STREAMINGA"
ENV NODE_ENV=production

# Build frontend assets
RUN npm run build

# Clear config and cache
RUN php artisan config:clear && php artisan cache:clear

# Generate application key (if not set)
RUN php artisan key:generate --force

# Expose port 10000
EXPOSE 10000

# Start Apache
CMD ["apache2-foreground"]