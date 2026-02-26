# Deploy do Dashboard em um Servidor Local (Windows Server 2019 VM)

Este documento descreve como mover a aplicação para uma máquina virtual com Windows Server 2019 e manter os serviços rodando automaticamente, permitindo desligar o PC atual.

## Pré-requisitos no servidor
1. Acesso administrativo ao Windows Server 2019.
2. Conexão de rede com outros computadores que usarão o dashboard.
3. Espaço em disco suficiente (poucos MB).

## Passo 1 – Instalar Node.js
1. Acesse `https://nodejs.org/en/download/` e baixe o instalador LTS (Windows x64).
2. Execute o instalador e aceite as opções padrão. Marque "Add to PATH".
3. Após a instalação abra PowerShell e verifique:
   ```powershell
   node -v
   npm -v
   ```
   Deve exibir as versões instaladas.

## Passo 2 – Transferir o código
No servidor, escolha uma pasta onde ficará o projeto (por exemplo `C:\velocimetro`).
Copie toda a pasta do workspace (`backend`, `frontend`, etc) para essa localização. Você pode usar:

```powershell
# do servidor, via compartilhamento SMB ou scp/WinSCP
xcopy "\\meu-pc\Projetos\Velocimetro faturamento" "C:\velocimetro" /E /I /Y
```

ou transferir o repositório via git se preferir.

## Passo 3 – Instalar dependências e construir frontend
Abra PowerShell no caminho `C:\velocimetro\frontend`:

```powershell
cd C:\velocimetro\frontend
npm install
npm run build    # gera arquivos estáticos em dist/
```

> A aplicação pode rodar em modo de produção usando os arquivos construídos, mas no dev usaremos `npm run dev`.

Instale também dependências do backend:

```powershell
cd C:\velocimetro\backend
npm install
```

Ajuste `.env` se necessário (por exemplo variáveis de conexão com o banco).

## Passo 4 – Configurar PM2 para gerenciamento automático
PM2 é um gerenciador de processos Node que pode reiniciar apps e criar serviço do Windows.

```powershell
npm install -g pm2
```

Ainda no diretório do backend, inicie o servidor:

```powershell
cd C:\velocimetro\backend
pm2 start src/index.ts --name velocimetro-backend --interpreter=ts-node
pm2 start ..\frontend\dist\server.js --name velocimetro-frontend --interpreter=node
```

> **Observação:** se você não estiver usando um servidor Node para o frontend (serve arquivos estáticos), então basta servir a pasta `dist` com um servidor web local (nginx, IIS) ou criar um pequeno script Express estático. Alternativamente, podemos manter o dev server (não recomendado para produção).

Para habilitar o serviço PM2 ao reiniciar o Windows:

```powershell
pm2 service install
pm2 save
```

Isso cria um serviço "pm2" que iniciará automaticamente. O backend e frontend serão restaurados com `pm2 resurrect`.

## Passo 5 – Configurar firewall
Abra as portas 3000 (backend) e 517x (frontend se usar dev server) no Windows Firewall:

```powershell
New-NetFirewallRule -DisplayName "Velocimetro Backend" -Direction Inbound -Protocol TCP -LocalPort 3000 -Action Allow
New-NetFirewallRule -DisplayName "Velocimetro Frontend" -Direction Inbound -Protocol TCP -LocalPort 5173-5179 -Action Allow
```

Use apenas as portas que realmente estiverem sendo usadas.

## Passo 6 – Acessar a partir da rede
No computador cliente, abra navegador e acesse:

```
http://<ip-do-servidor>:3000/    # API
http://<ip-do-servidor>:5175/    # Frontend Vite
```

Se optou por servir o frontend estático em outra porta/servidor, aponte para ele.

## Passo 7 – Manutenção
- Para ver logs: `pm2 logs velocimetro-backend` ou `pm2 logs velocimetro-frontend`.
- Para reiniciar: `pm2 restart velocimetro-backend`.
- Atualização: pare os processos `pm2 stop ...`, substitua os arquivos, depois `npm install` e `pm2 restart`.


### Alternativa usando Docker
Se preferir isolamento e portabilidade futura, crie `Dockerfile`s para backend e frontend e um `docker-compose.yml`. Posso ajudar a montar se houver interesse.

---

Com essas etapas o dashboard passa a rodar na VM, desligando o PC original. Caso precise de ajuda com etapas específicas (ex.: configurar IIS, montar rota reversa, ou migrar banco de dados), avise.