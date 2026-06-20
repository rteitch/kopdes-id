# =============================================
# kopdes.id - Deployment Script for Windows
# =============================================
# Cara pakai:
#   .\deploy.ps1 setup     - Install dependencies & setup database
#   .\deploy.ps1 dev       - Jalankan development server
#   .\deploy.ps1 build     - Build untuk production
#   .\deploy.ps1 start     - Jalankan production server
#   .\deploy.ps1 seed      - Seed data demo
#   .\deploy.ps1 docker    - Jalankan dengan Docker
#   .\deploy.ps1 docker-down - Stop Docker containers
#   .\deploy.ps1 db-reset  - Reset database
#   .\deploy.ps1 studio    - Buka Prisma Studio
#   .\deploy.ps1 push      - Git commit & push
# =============================================

param(
    [Parameter(Position=0)]
    [ValidateSet("setup", "dev", "build", "start", "seed", "docker", "docker-down", "docker-logs", "db-reset", "studio", "push", "help")]
    [string]$Command = "help"
)

$ErrorActionPreference = "Stop"

function Write-Header {
    param([string]$Text)
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  $Text" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
}

function Write-Step {
    param([string]$Text)
    Write-Host ">>> $Text" -ForegroundColor Cyan
}

function Write-Ok {
    param([string]$Text)
    Write-Host "✅ $Text" -ForegroundColor Green
}

function Write-Err {
    param([string]$Text)
    Write-Host "❌ $Text" -ForegroundColor Red
}

function Test-Command {
    param([string]$Name)
    $null = Get-Command $Name -ErrorAction SilentlyContinue
    return $?
}

# =============================================
# COMMANDS
# =============================================

switch ($Command) {
    "setup" {
        Write-Header "kopdes.id - Setup"

        # Check prerequisites
        Write-Step "Checking prerequisites..."

        if (-not (Test-Command "node")) {
            Write-Err "Node.js not found! Download from https://nodejs.org/"
            exit 1
        }
        Write-Ok "Node.js found: $(node --version)"

        if (-not (Test-Command "npm")) {
            Write-Err "npm not found!"
            exit 1
        }
        Write-Ok "npm found: $(npm --version)"

        if (-not (Test-Command "docker")) {
            Write-Host "⚠️  Docker not found. You can still use local PostgreSQL." -ForegroundColor Yellow
        } else {
            Write-Ok "Docker found: $(docker --version)"
        }

        # Install dependencies
        Write-Step "Installing dependencies..."
        npm install
        Write-Ok "Dependencies installed"

        # Check .env
        if (-not (Test-Path ".env")) {
            Write-Step "Creating .env file..."
            @"
# Database (PostgreSQL)
DATABASE_URL="postgresql://postgres:kopdes_password_2026@localhost:5432/kopdes_id"
DIRECT_URL="postgresql://postgres:kopdes_password_2026@localhost:5432/kopdes_id"

# Auth
NEXTAUTH_SECRET="kopdes-id-secret-$(Get-Random)"
NEXTAUTH_URL="http://localhost:3000"

# AI Chatbot (opsional)
ANTHROPIC_API_KEY="your-anthropic-api-key"

# WhatsApp (opsional)
FONNTE_TOKEN="your-fonnte-token"
"@ | Out-File -FilePath ".env" -Encoding utf8
            Write-Ok ".env created"
            Write-Host "⚠️  Please edit .env with your database credentials!" -ForegroundColor Yellow
        } else {
            Write-Ok ".env already exists"
        }

        # Generate Prisma Client
        Write-Step "Generating Prisma Client..."
        npx prisma generate
        Write-Ok "Prisma Client generated"

        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "  Setup complete! Next steps:" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "  Option A - Docker (easiest):" -ForegroundColor Yellow
        Write-Host "    .\deploy.ps1 docker"
        Write-Host ""
        Write-Host "  Option B - Local PostgreSQL:" -ForegroundColor Yellow
        Write-Host "    1. Install PostgreSQL from https://www.postgresql.org/"
        Write-Host "    2. Create database: CREATE DATABASE kopdes_id;"
        Write-Host "    3. Edit .env with your PostgreSQL credentials"
        Write-Host "    4. .\deploy.ps1 db-reset"
        Write-Host "    5. .\deploy.ps1 dev"
        Write-Host ""
    }

    "dev" {
        Write-Header "kopdes.id - Development Server"
        Write-Step "Starting development server..."
        Write-Host "  URL: http://localhost:3000" -ForegroundColor Yellow
        Write-Host ""
        npm run dev
    }

    "build" {
        Write-Header "kopdes.id - Production Build"
        Write-Step "Building for production..."
        npm run build
        Write-Ok "Build complete!"
    }

    "start" {
        Write-Header "kopdes.id - Production Server"
        Write-Step "Starting production server..."
        Write-Host "  URL: http://localhost:3000" -ForegroundColor Yellow
        Write-Host ""
        npm start
    }

    "seed" {
        Write-Header "kopdes.id - Seed Demo Data"
        Write-Step "Seeding database with demo data..."
        npx tsx prisma/seed.ts
        Write-Ok "Database seeded!"
        Write-Host ""
        Write-Host "  Login credentials:" -ForegroundColor Yellow
        Write-Host "    Ketua:      081234567890 (Hadi Santoso)"
        Write-Host "    Bendahara:  081234567891 (Sari Rahayu)"
        Write-Host "    OTP: otomatis terisi di demo mode"
        Write-Host ""
    }

    "docker" {
        Write-Header "kopdes.id - Docker Deploy"

        if (-not (Test-Command "docker")) {
            Write-Err "Docker not found! Install Docker Desktop from https://docker.com/"
            exit 1
        }

        Write-Step "Starting Docker containers (PostgreSQL + App)..."
        docker-compose up -d --build

        Write-Host ""
        Write-Step "Waiting for database to be ready..."
        Start-Sleep -Seconds 10

        Write-Step "Running database migration..."
        docker-compose exec -T app npx prisma db push --skip-generate 2>$null

        Write-Step "Seeding demo data..."
        docker-compose exec -T app npx tsx prisma/seed.ts 2>$null

        Write-Ok "Docker deployment complete!"
        Write-Host ""
        Write-Host "  🌐 URL: http://localhost:3000" -ForegroundColor Yellow
        Write-Host "  🗄️  Database: localhost:5432" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "  Login:" -ForegroundColor Yellow
        Write-Host "    Ketua:      081234567890"
        Write-Host "    Bendahara:  081234567891"
        Write-Host ""
        Write-Host "  Commands:" -ForegroundColor Cyan
        Write-Host "    .\deploy.ps1 docker-logs   - Lihat logs"
        Write-Host "    .\deploy.ps1 docker-down   - Stop containers"
        Write-Host ""
    }

    "docker-down" {
        Write-Header "kopdes.id - Docker Stop"
        Write-Step "Stopping Docker containers..."
        docker-compose down
        Write-Ok "Containers stopped"
    }

    "docker-logs" {
        Write-Host "Docker logs (Ctrl+C to exit):" -ForegroundColor Cyan
        docker-compose logs -f
    }

    "db-reset" {
        Write-Header "kopdes.id - Reset Database"
        Write-Host "⚠️  This will DELETE ALL DATA in the database!" -ForegroundColor Red
        $confirm = Read-Host "Continue? (y/n)"
        if ($confirm -ne "y") {
            Write-Host "Cancelled."
            exit 0
        }
        Write-Step "Resetting database..."
        npx prisma db push --force-reset
        Write-Ok "Database reset complete"

        Write-Step "Seeding demo data..."
        npx tsx prisma/seed.ts
        Write-Ok "Demo data seeded"
    }

    "studio" {
        Write-Header "kopdes.id - Prisma Studio"
        Write-Step "Opening Prisma Studio at http://localhost:5555..."
        npx prisma studio
    }

    "push" {
        Write-Header "kopdes.id - Git Push"
        $msg = Read-Host "Commit message (default: update)"
        if ([string]::IsNullOrWhiteSpace($msg)) { $msg = "update" }
        Write-Step "Committing changes..."
        git add .
        git commit -m $msg
        Write-Step "Pushing to remote..."
        git push
        Write-Ok "Pushed to GitHub!"
    }

    "help" {
        Write-Header "kopdes.id - Deployment Script"
        Write-Host "Usage: .\deploy.ps1 <command>`n" -ForegroundColor Yellow
        Write-Host "Available commands:" -ForegroundColor Cyan
        Write-Host "  setup        Install dependencies & setup project"
        Write-Host "  dev          Start development server"
        Write-Host "  build        Build for production"
        Write-Host "  start        Start production server"
        Write-Host "  seed         Seed demo data"
        Write-Host "  docker       Deploy with Docker (PostgreSQL + App)"
        Write-Host "  docker-down  Stop Docker containers"
        Write-Host "  docker-logs  View Docker logs"
        Write-Host "  db-reset     Reset database & re-seed"
        Write-Host "  studio       Open Prisma Studio (GUI)"
        Write-Host "  push         Git commit & push"
        Write-Host "  help         Show this help"
        Write-Host ""
    }
}