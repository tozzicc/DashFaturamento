# Windows Terminal — adicionar profile para DashFaturamento


Este guia mostra como adicionar perfis permanentes ao Windows Terminal para iniciar o backend e o frontend em `dev`.

1) Abra o Windows Terminal → Configurações (Settings).
2) Clique em "Abrir JSON" (ou procure o arquivo `settings.json`).
3) Encontre a chave `profiles` → `list` e cole os objetos `backend` e/ou `frontend` do arquivo `windows-terminal-profile.json` como novos itens na lista.

Exemplo (cole dois objetos dentro de `profiles` -> `list`):

```
{
	"guid": "{b3f9a1d2-4c9a-4f7e-9b2b-1a2c3d4e5f60}",
	"name": "DashFaturamento - Backend",
	"commandline": "powershell -NoExit -NoProfile -Command \"cd \"c:\\DashFaturamento\\backend\"; npm run dev\"",
	"startingDirectory": "c:\\DashFaturamento\\backend"
},
{
	"guid": "{d4e2b6c7-7f8a-4b1c-a2d3-6e7f8a9b0c11}",
	"name": "DashFaturamento - Frontend",
	"commandline": "powershell -NoExit -NoProfile -Command \"cd \"c:\\DashFaturamento\\frontend\"; npm run dev\"",
	"startingDirectory": "c:\\DashFaturamento\\frontend"
}
```

Notas:
- Ajuste `startingDirectory` e `commandline` caso seu caminho de projeto seja diferente.
- O `guid` deve ser único; se já houver conflito, gere outro GUID (por exemplo via `New-Guid` no PowerShell).
- Para abrir rapidamente um terminal com um profile específico, use:

```
wt -p "DashFaturamento - Backend"
wt -p "DashFaturamento - Frontend"
```

