#!/bin/bash

# Script de instalação automática do projeto

echo ""
echo "========================================"
echo "Dashboard Velocimetro Faturamento"
echo "========================================"
echo ""

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Por favor instale Node.js primeiro."
    exit 1
fi

echo "✅ Node.js encontrado"
node --version
echo ""

# Instalar Backend
echo "========================================"
echo "Instalando Backend..."
echo "========================================"
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Erro ao instalar backend"
    exit 1
fi
echo "✅ Backend instalado com sucesso"
cd ..
echo ""

# Instalar Frontend
echo "========================================"
echo "Instalando Frontend..."
echo "========================================"
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Erro ao instalar frontend"
    exit 1
fi
echo "✅ Frontend instalado com sucesso"
cd ..
echo ""

echo "========================================"
echo "✅ Instalação Concluída!"
echo "========================================"
echo ""
echo "🚀 Para iniciar o projeto:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend"
echo "  npm run dev"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "Abra o navegador em: http://localhost:5173"
echo ""
