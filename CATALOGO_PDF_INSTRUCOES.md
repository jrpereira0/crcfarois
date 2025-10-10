# 📄 Instruções para Gerenciar o Catálogo PDF

## Como Fazer Upload do Catálogo no Cloudinary

### Passo 1: Preparar o PDF
1. Crie seu catálogo PDF usando qualquer ferramenta (Adobe, Canva, InDesign, etc.)
2. Nomeie o arquivo como: `catalogo-crc-farois-2025.pdf`
3. Certifique-se que o PDF está otimizado (tamanho razoável para download)

### Passo 2: Fazer Upload no Cloudinary

#### Opção A: Upload Manual via Dashboard
1. Acesse: https://console.cloudinary.com/
2. Faça login com suas credenciais
3. Vá em **Media Library** no menu lateral
4. Crie uma pasta chamada `catalogo` (se não existir)
5. Clique em **Upload** → **Upload Files**
6. Selecione o arquivo `catalogo-crc-farois-2025.pdf`
7. Arraste para dentro da pasta `catalogo`

#### Opção B: Upload via Upload Widget (Recomendado)
1. Use o widget de upload do próprio site (se configurado)
2. Selecione a pasta destino: `catalogo`
3. Faça upload do PDF

### Passo 3: Verificar a URL

Após o upload, seu PDF estará disponível em:
```
https://res.cloudinary.com/SEU_CLOUD_NAME/raw/upload/v1/catalogo/catalogo-crc-farois-2025.pdf
```

Substitua `SEU_CLOUD_NAME` pelo nome do seu cloud (já configurado no .env)

### Atualizar o Catálogo

Para atualizar o catálogo:
1. Faça upload do novo PDF **com o mesmo nome** (`catalogo-crc-farois-2025.pdf`)
2. O Cloudinary irá sobrescrever automaticamente
3. Aguarde alguns minutos para o cache do CDN atualizar (ou limpe o cache manualmente)

**Dica**: Se quiser forçar atualização imediata, adicione `?v=TIMESTAMP` na URL ou use a funcionalidade de "Invalidate Cache" do Cloudinary.

## Vantagens desta Solução

✅ **Sem necessidade de redeploy** - Atualize o PDF quando quiser sem mexer no código  
✅ **CDN Global** - Download rápido em qualquer lugar do mundo  
✅ **Histórico de versões** - Cloudinary mantém versões antigas  
✅ **Analytics** - Pode rastrear quantos downloads foram feitos  
✅ **Transformações** - Pode comprimir/otimizar o PDF automaticamente  

## Formato Recomendado do Catálogo PDF

### Estrutura Sugerida:
1. **Capa**
   - Logo CRC Faróis
   - Título: "Catálogo 2025"
   - Slogan/descrição da empresa

2. **Índice**
   - Produtos Exclusivos
   - Produtos Importados
   - Produtos Nacionais

3. **Seções de Produtos** (agrupados por origem)
   - Imagem do produto
   - Nome/Título
   - SKU
   - Status (Disponível/Indisponível)

4. **Rodapé** (todas as páginas)
   - Website: www.crcfarois.ind.br
   - Email: contato@crcfarois.ind.br
   - Telefone: (11) 99226-8645

### Cores da Marca:
- **Azul Principal**: #2b308c
- **Branco**: #ffffff
- **Cinza**: #666666
- **Verde (Disponível)**: #10b981
- **Cinza (Indisponível)**: #6b7280

### Ferramentas Recomendadas:
- **Canva** (fácil e gratuito): https://www.canva.com/
- **Adobe InDesign** (profissional)
- **Microsoft Word/PowerPoint** (export para PDF)

## Troubleshooting

### PDF não está carregando?
1. Verifique se o nome do arquivo está correto
2. Verifique se está na pasta `catalogo`
3. Confirme que o Cloud Name no `.env` está correto
4. Tente acessar a URL diretamente no navegador

### Download muito lento?
1. Otimize o PDF (reduza tamanho de imagens)
2. Use compressão do Cloudinary
3. Verifique se está usando a URL do CDN (res.cloudinary.com)

## Contato para Suporte

Se precisar de ajuda técnica com o upload ou configuração, entre em contato com o desenvolvedor.

