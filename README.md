# 🚗 Site Borracharia & AutoCenter

Site estático moderno para borracharia com foco em conversão via WhatsApp.

## 📁 Arquivos do Projeto

- `index.html` - Estrutura HTML completa
- `styles.css` - Estilos CSS responsivos
- `script.js` - Funcionalidades JavaScript
- `README.md` - Este arquivo

## ⚙️ Personalização

### 1. Informações Básicas

**No arquivo `index.html`:**
- Substitua `[NOME DA LOJA]` pelo nome da sua borracharia
- Substitua `[Cidade]` pela sua cidade
- Substitua `[Bairro]` pelo seu bairro
- Atualize o endereço completo
- Atualize o telefone no rodapé

**No arquivo `script.js`:**
- Linha 2: Altere `WHATSAPP_NUMBER` para o seu número no formato `55DDDNÚMERO`
- Exemplo: `"5511999999999"` (55 + 11 + 999999999)

### 2. Preços dos Serviços

No arquivo `index.html`, seção "Nossos Serviços", atualize os preços:
```html
<p>a partir de R$ 79</p>
```

### 3. Depoimentos

Substitua os depoimentos na seção "O que nossos clientes dizem" por depoimentos reais dos seus clientes.

### 4. FAQ

Atualize as perguntas e respostas na seção "Perguntas frequentes" conforme necessário.

## 🎨 Personalização Visual

### Cores (arquivo `styles.css`)

As cores estão definidas como variáveis CSS no início do arquivo:
```css
:root {
    --bg: #0b1118;        /* Fundo principal */
    --card: #0f172a;      /* Fundo dos cards */
    --text: #e5e7eb;      /* Texto principal */
    --muted: #94a3b8;     /* Texto secundário */
    --brand: #0ea5e9;     /* Cor da marca */
    --cta: #f59e0b;       /* Cor dos preços */
    --ok: #10b981;        /* Cor do WhatsApp */
}
```

## 📱 Funcionalidades

### WhatsApp Integration
- **CTAs diretos**: Botões "Chamar no WhatsApp" abrem com mensagem padrão
- **Formulário de agendamento**: Gera mensagem detalhada com dados do cliente
- **Barra flutuante**: Botão fixo no canto inferior direito
- **UTM tracking**: Parâmetros para rastreamento de conversões

### Formulário de Agendamento
- Validação de campos obrigatórios
- Máscara automática para telefone e placa
- Formatação de data e hora
- Geração automática de mensagem para WhatsApp

### Responsividade
- Design mobile-first
- Adaptação para tablets e desktop
- Navegação otimizada para touch

## 🚀 Como Usar

1. **Edite os arquivos** conforme as instruções acima
2. **Teste localmente** abrindo `index.html` no navegador
3. **Faça upload** para seu servidor web
4. **Configure o domínio** para apontar para os arquivos

## 📊 SEO e Performance

- Meta tags otimizadas
- Estrutura HTML semântica
- Imagens com lazy loading
- Código limpo e otimizado
- Acessibilidade (ARIA labels, focus visible)

## 🔧 Tecnologias

- HTML5 semântico
- CSS3 com Grid e Flexbox
- JavaScript vanilla (sem frameworks)
- Design responsivo
- Acessibilidade WCAG

## 📞 Suporte

Para dúvidas ou personalizações adicionais, consulte a documentação ou entre em contato.

---

**Desenvolvido com foco em conversão e experiência do usuário** 🎯
