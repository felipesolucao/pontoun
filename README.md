# PontoCRM

CRM responsivo para gestão de recebíveis em um pipeline Kanban.

## Recursos

- 11 etapas de cobrança com cores e totais próprios.
- Cards arrastáveis entre etapas com atualização imediata dos indicadores.
- Indicadores de clientes, valor em aberto, negociações e recuperação.
- Busca por empresa, CNPJ ou e-mail.
- Importação de clientes por CSV.
- Cadastro e consulta detalhada de clientes.
- Layout responsivo para desktop, tablet e celular.

## Importação CSV

Use a primeira linha como cabeçalho e, nas seguintes, informe os campos nesta ordem:

```csv
nome,cnpj,valor,parcelas,colaboradores,telefone,email,sindicato
Empresa Exemplo,00.000.000/0001-00,15000,3,25,(11) 99999-9999,financeiro@exemplo.com,Sindicato
```

## Desenvolvimento

```bash
npm install
npm run dev
```

Para validar uma versão de produção:

```bash
npm run lint
npm run build
```
