# Pontoun

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Deploy no Railway pelo GitHub

O projeto inclui um `Dockerfile` e um `railway.json`, portanto o Railway detecta a
configuração de build automaticamente. O Nginx serve a aplicação e redireciona
rotas do React para `index.html`.

1. Envie esta branch para o repositório `pontoun` no GitHub.
2. No [Railway](https://railway.com/new), escolha **Deploy from GitHub repo** e
   autorize o acesso ao repositório `pontoun`.
3. No serviço criado, abra **Variables** e cadastre:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
4. Inicie (ou refaça) o deploy. As variáveis `VITE_*` são incorporadas ao bundle
   durante o build, então qualquer alteração nelas exige um novo deploy.
5. Em **Settings > Networking**, clique em **Generate Domain** para publicar o
   endereço da aplicação.

O Railway fará novos deploys automaticamente quando houver commits na branch
conectada. O endpoint `/healthz` é usado para verificar a saúde do container.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
