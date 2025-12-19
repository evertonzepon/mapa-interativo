(async function(){
    const container = document.getElementById('svg-container');
    const tooltip = document.getElementById('map-tooltip');
    const searchInput = document.getElementById('filtro-estado');
    const clearBtn = document.getElementById('limpar-filtro-btn');
    const dynamicInfoCard = document.getElementById('dynamic-info-card');
    const tablePlaceholder = document.getElementById('table-placeholder');
    const SVG_FILE = 'img/brazil-states.svg';

    // =============================================
    // =========== CONSTANTES DOS BOTÕES ===========
    // =============================================
    const btnSacre = document.getElementById('btn-sacre');
    const btnPeregrino = document.getElementById('btn-peregrino');
    const btnLanario = document.getElementById('btn-lanario');
    // =============================================
    // =============================================
    
    // Novos elementos do dialog
    const dialog = document.getElementById('info-dialog');
    const closeBtn = document.getElementById('close-dialog-btn');
    const mainContentWrapper = document.querySelector('.main-content-wrapper');

    // Elementos do easter egg do rodapé
    const zeponTrigger = document.getElementById('zepon-trigger');
    const zeponDetails = document.getElementById('zepon-details');

    // Novos elementos para o diálogo de imagem
    const imageDialog = document.getElementById('image-dialog');
    const dialogImage = document.getElementById('dialog-image');
    const dialogTitle = document.getElementById('dialog-title');
    const dialogText = document.getElementById('dialog-text');
    const closeImageBtn = document.getElementById('close-image-btn');

    // HTML para os mini cards
    const miniCardHtml = `
        <div id="falcon-details" class="hidden-content">
            <p>O Falcão Peregrino é o pássaro mais rápido do mundo!</p>
            <img src="img/peregrino.png" alt="Falcão Peregrino" class="mini-image">
        </div>
        <div id="coruja-details" class="hidden-content">
            <p>A coruja é um animal de hábitos noturnos e com ótima visão.</p>
            <img src="img/coruja.png" alt="Coruja" class="mini-image">
        </div>
    `;

    // Variáveis para contar os cliques dos easter eggs
    let zeponClickCount = 0;
    let falconClickCount = 0;
    let corujaClickCount = 0;
    let acreClickCount = 0;

    // Exibe o dialog na entrada do site
    dialog.showModal();

    // Ao clicar no botão, fecha o dialog e exibe o conteúdo principal
    closeBtn.addEventListener('click', () => {
        dialog.close();
        mainContentWrapper.style.display = 'flex';
        // Ajusta a altura do container quando o conteúdo principal é exibido
        try { adjustContainerHeight(); } catch (e) { /* function may be defined later; ignore */ }
    });
    
    // Lógica do easter egg Zepon com contador de 7 cliques
    zeponTrigger.addEventListener('click', () => {
        zeponClickCount++;
        if (zeponClickCount >= 7) {
            zeponDetails.classList.toggle('expanded');
            zeponClickCount = 0; // Reseta o contador
        }
    });

    // Ativa o trigger via teclado (Enter ou Space) para acessibilidade
    zeponTrigger.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') {
            ev.preventDefault();
            zeponTrigger.click();
        }
    });

    // Lógica para abrir o card de imagem
    function openImageCard(imageSrc, title, text) {
        dialogImage.src = imageSrc;
        dialogTitle.textContent = title;
        dialogText.textContent = text;
        imageDialog.showModal();
    }
    
    // Lógica para fechar o card de imagem
    closeImageBtn.addEventListener('click', () => {
        imageDialog.close();
    });

    // Dados dos estados com apenas sigla e nome
    const estadosData = [
        { uf: 'AC', nome: 'Acre' },
        { uf: 'AL', nome: 'Alagoas' },
        { uf: 'AP', nome: 'Amapá' },
        { uf: 'AM', nome: 'Amazonas' },
        { uf: 'BA', nome: 'Bahia' },
        { uf: 'CE', nome: 'Ceará' },
        { uf: 'DF', nome: 'Distrito Federal' },
        { uf: 'ES', nome: 'Espírito Santo' },
        { uf: 'GO', nome: 'Goiás' },
        { uf: 'MA', nome: 'Maranhão' },
        { uf: 'MT', nome: 'Mato Grosso' },
        { uf: 'MS', nome: 'Mato Grosso do Sul' },
        { uf: 'MG', nome: 'Minas Gerais' },
        { uf: 'PA', nome: 'Pará' },
        { uf: 'PB', nome: 'Paraíba' },
        { uf: 'PR', nome: 'Paraná' },
        { uf: 'PE', nome: 'Pernambuco' },
        { uf: 'PI', nome: 'Piauí' },
        { uf: 'RJ', nome: 'Rio de Janeiro' },
        { uf: 'RN', nome: 'Rio Grande do Norte' },
        { uf: 'RS', nome: 'Rio Grande do Sul' },
        { uf: 'RO', nome: 'Rondônia' },
        { uf: 'RR', nome: 'Roraima' },
        { uf: 'SC', nome: 'Santa Catarina' },
        { uf: 'SP', nome: 'São Paulo' },
        { uf: 'SE', nome: 'Sergipe' },
        { uf: 'TO', nome: 'Tocantins' },
    ];

    // Dados de atribuição mapeados por sigla de estado
    // Cada entrada possui um campo `filas` que é um array de objetos com informações
    // sobre a fila: nome, tipo (falcon/coruja), role (Ajudantes/Motoristas), equipe e responsável.
    const atribuicoes = {
        'AC': { responsavel: 'Lanários - José Alves (Ajudantes) / Peregrino - Leonardo Chaves (Motoristas)', regiao: 'Norte', estados: 'AC, AP, AM, PA, RO, RR', filas: [
            { name: 'Falcon Lanários', tipo: 'falcon', role: 'Ajudantes', equipe: 'Lanários', responsavel: 'José Alves' },
            { name: 'Coruja Lanários', tipo: 'coruja', role: 'Ajudantes', equipe: 'Lanários', responsavel: 'José Alves' },
            { name: 'Falcon Peregrino', tipo: 'falcon', role: 'Motoristas', equipe: 'Peregrino', responsavel: 'Leonardo Chaves' },
            { name: 'Coruja Peregrino', tipo: 'coruja', role: 'Motoristas', equipe: 'Peregrino', responsavel: 'Leonardo Chaves' },
        ] },
        'AP': { responsavel: 'Lanários - José Alves (Ajudantes) / Peregrino - Leonardo Chaves (Motoristas)', regiao: 'Norte', estados: 'AC, AP, AM, PA, RO, RR', filas: [
            { name: 'Falcon Lanários', tipo: 'falcon', role: 'Ajudantes', equipe: 'Lanários', responsavel: 'José Alves' },
            { name: 'Coruja Lanários', tipo: 'coruja', role: 'Ajudantes', equipe: 'Lanários', responsavel: 'José Alves' },
            { name: 'Falcon Peregrino', tipo: 'falcon', role: 'Motoristas', equipe: 'Peregrino', responsavel: 'Leonardo Chaves' },
            { name: 'Coruja Peregrino', tipo: 'coruja', role: 'Motoristas', equipe: 'Peregrino', responsavel: 'Leonardo Chaves' },
        ] },
        'AM': { responsavel: 'Lanários - José Alves (Ajudantes) / Peregrino - Leonardo Chaves (Motoristas)', regiao: 'Norte', estados: 'AC, AP, AM, PA, RO, RR', filas: [
            { name: 'Falcon Lanários', tipo: 'falcon', role: 'Ajudantes', equipe: 'Lanários', responsavel: 'José Alves' },
            { name: 'Coruja Lanários', tipo: 'coruja', role: 'Ajudantes', equipe: 'Lanários', responsavel: 'José Alves' },
            { name: 'Falcon Peregrino', tipo: 'falcon', role: 'Motoristas', equipe: 'Peregrino', responsavel: 'Leonardo Chaves' },
            { name: 'Coruja Peregrino', tipo: 'coruja', role: 'Motoristas', equipe: 'Peregrino', responsavel: 'Leonardo Chaves' },
        ] },
        'PA': { responsavel: 'Lanários - José Alves (Ajudantes) / Peregrino - Leonardo Chaves (Motoristas)', regiao: 'Norte', estados: 'AC, AP, AM, PA, RO, RR', filas: [
            { name: 'Falcon Lanários', tipo: 'falcon', role: 'Ajudantes', equipe: 'Lanários', responsavel: 'José Alves' },
            { name: 'Coruja Lanários', tipo: 'coruja', role: 'Ajudantes', equipe: 'Lanários', responsavel: 'José Alves' },
            { name: 'Falcon Peregrino', tipo: 'falcon', role: 'Motoristas', equipe: 'Peregrino', responsavel: 'Leonardo Chaves' },
            { name: 'Coruja Peregrino', tipo: 'coruja', role: 'Motoristas', equipe: 'Peregrino', responsavel: 'Leonardo Chaves' },
        ] },
        'RO': { responsavel: 'Lanários - José Alves (Ajudantes) / Peregrino - Leonardo Chaves (Motoristas)', regiao: 'Norte', estados: 'AC, AP, AM, PA, RO, RR', filas: [
            { name: 'Falcon Lanários', tipo: 'falcon', role: 'Ajudantes', equipe: 'Lanários', responsavel: 'José Alves' },
            { name: 'Coruja Lanários', tipo: 'coruja', role: 'Ajudantes', equipe: 'Lanários', responsavel: 'José Alves' },
            { name: 'Falcon Peregrino', tipo: 'falcon', role: 'Motoristas', equipe: 'Peregrino', responsavel: 'Leonardo Chaves' },
            { name: 'Coruja Peregrino', tipo: 'coruja', role: 'Motoristas', equipe: 'Peregrino', responsavel: 'Leonardo Chaves' },
        ] },
        'RR': { responsavel: 'Lanários - José Alves (Ajudantes) / Peregrino - Leonardo Chaves (Motoristas)', regiao: 'Norte', estados: 'AC, AP, AM, PA, RO, RR', filas: [
            { name: 'Falcon Lanários', tipo: 'falcon', role: 'Ajudantes', equipe: 'Lanários', responsavel: 'José Alves' },
            { name: 'Coruja Lanários', tipo: 'coruja', role: 'Ajudantes', equipe: 'Lanários', responsavel: 'José Alves' },
            { name: 'Falcon Peregrino', tipo: 'falcon', role: 'Motoristas', equipe: 'Peregrino', responsavel: 'Leonardo Chaves' },
            { name: 'Coruja Peregrino', tipo: 'coruja', role: 'Motoristas', equipe: 'Peregrino', responsavel: 'Leonardo Chaves' },
        ] },
        'TO': { responsavel: 'Lanários - José Alves (Ajudantes) / Peregrino - Leonardo Chaves (Motoristas)', regiao: 'Norte', estados: 'TO', filas: [
            { name: 'Falcon Lanários', tipo: 'falcon', role: 'Ajudantes', equipe: 'Lanários', responsavel: 'José Alves' },
            { name: 'Coruja Lanários', tipo: 'coruja', role: 'Ajudantes', equipe: 'Lanários', responsavel: 'José Alves' },
            { name: 'Falcon Peregrino', tipo: 'falcon', role: 'Motoristas', equipe: 'Peregrino', responsavel: 'Leonardo Chaves' },
            { name: 'Coruja Peregrino', tipo: 'coruja', role: 'Motoristas', equipe: 'Peregrino', responsavel: 'Leonardo Chaves' },
        ] },
        'GO': { responsavel: 'Lanários - José Alves (Ajudantes) / Peregrino - Leonardo Chaves (Motoristas)', regiao: 'Centro-Oeste', estados: 'GO, MS, DF', filas: [
            { name: 'Falcon Lanários', tipo: 'falcon', role: 'Ajudantes', equipe: 'Lanários', responsavel: 'José Alves' },
            { name: 'Coruja Lanários', tipo: 'coruja', role: 'Ajudantes', equipe: 'Lanários', responsavel: 'José Alves' },
            { name: 'Falcon Peregrino', tipo: 'falcon', role: 'Motoristas', equipe: 'Peregrino', responsavel: 'Leonardo Chaves' },
            { name: 'Coruja Peregrino', tipo: 'coruja', role: 'Motoristas', equipe: 'Peregrino', responsavel: 'Leonardo Chaves' },
        ] },
        'MS': { responsavel: 'Lanários - José Alves (Ajudantes) / Peregrino - Leonardo Chaves (Motoristas)', regiao: 'Centro-Oeste', estados: 'GO, MS, DF', filas: [
            { name: 'Falcon Lanários', tipo: 'falcon', role: 'Ajudantes', equipe: 'Lanários', responsavel: 'José Alves' },
            { name: 'Coruja Lanários', tipo: 'coruja', role: 'Ajudantes', equipe: 'Lanários', responsavel: 'José Alves' },
            { name: 'Falcon Peregrino', tipo: 'falcon', role: 'Motoristas', equipe: 'Peregrino', responsavel: 'Leonardo Chaves' },
            { name: 'Coruja Peregrino', tipo: 'coruja', role: 'Motoristas', equipe: 'Peregrino', responsavel: 'Leonardo Chaves' },
        ] },
        'DF': { responsavel: 'Lanários - José Alves (Ajudantes) / Peregrino - Leonardo Chaves (Motoristas)', regiao: 'Centro-Oeste', estados: 'GO, MS, DF', filas: [
            { name: 'Falcon Lanários', tipo: 'falcon', role: 'Ajudantes', equipe: 'Lanários', responsavel: 'José Alves' },
            { name: 'Coruja Lanários', tipo: 'coruja', role: 'Ajudantes', equipe: 'Lanários', responsavel: 'José Alves' },
            { name: 'Falcon Peregrino', tipo: 'falcon', role: 'Motoristas', equipe: 'Peregrino', responsavel: 'Leonardo Chaves' },
            { name: 'Coruja Peregrino', tipo: 'coruja', role: 'Motoristas', equipe: 'Peregrino', responsavel: 'Leonardo Chaves' },
        ] },
        'MT': { responsavel: 'Lanários - José Alves (Ajudantes) / Peregrino - Leonardo Chaves (Motoristas)', regiao: 'Centro-Oeste', estados: 'MT', filas: [
            { name: 'Falcon Lanários', tipo: 'falcon', role: 'Ajudantes', equipe: 'Lanários', responsavel: 'José Alves' },
            { name: 'Coruja Lanários', tipo: 'coruja', role: 'Ajudantes', equipe: 'Lanários', responsavel: 'José Alves' },
            { name: 'Falcon Peregrino', tipo: 'falcon', role: 'Motoristas', equipe: 'Peregrino', responsavel: 'Leonardo Chaves' },
            { name: 'Coruja Peregrino', tipo: 'coruja', role: 'Motoristas', equipe: 'Peregrino', responsavel: 'Leonardo Chaves' },
        ] },
        'ES': { responsavel: 'Lanários - José Alves (Ajudantes) / Peregrino - Leonardo Chaves (Motoristas)', regiao: 'Sudeste', estados: 'ES, SP', filas: [
            { name: 'Falcon Lanários', tipo: 'falcon', role: 'Ajudantes', equipe: 'Lanários', responsavel: 'José Alves' },
            { name: 'Coruja Lanários', tipo: 'coruja', role: 'Ajudantes', equipe: 'Lanários', responsavel: 'José Alves' },
            { name: 'Falcon Peregrino', tipo: 'falcon', role: 'Motoristas', equipe: 'Peregrino', responsavel: 'Leonardo Chaves' },
            { name: 'Coruja Peregrino', tipo: 'coruja', role: 'Motoristas', equipe: 'Peregrino', responsavel: 'Leonardo Chaves' },
        ] },
        'SP': { responsavel: 'Lanários - José Alves (Ajudantes) / Sacre - Alexandre Donegá (Motoristas)', regiao: 'Sudeste', estados: 'ES, SP', filas: [
            { name: 'Falcon Lanários', tipo: 'falcon', role: 'Ajudantes', equipe: 'Lanários', responsavel: 'José Alves' },
            { name: 'Coruja Lanários', tipo: 'coruja', role: 'Ajudantes', equipe: 'Lanários', responsavel: 'José Alves' },
            { name: 'Falcon Sacre', tipo: 'falcon', role: 'Motoristas', equipe: 'Sacre', responsavel: 'Alexandre Donegá' },
            { name: 'Coruja Sacre', tipo: 'coruja', role: 'Motoristas', equipe: 'Sacre', responsavel: 'Alexandre Donegá' },
        ] },
        'MG': { responsavel: 'Lanários - José Alves (Ajudantes) / Peregrino - Leonardo Chaves (Motoristas)', regiao: 'Sudeste', estados: 'MG, RJ', filas: [
            { name: 'Falcon Lanários', tipo: 'falcon', role: 'Ajudantes', equipe: 'Lanários', responsavel: 'José Alves' },
            { name: 'Coruja Lanários', tipo: 'coruja', role: 'Ajudantes', equipe: 'Lanários', responsavel: 'José Alves' },
            { name: 'Falcon Peregrino', tipo: 'falcon', role: 'Motoristas', equipe: 'Peregrino', responsavel: 'Leonardo Chaves' },
            { name: 'Coruja Peregrino', tipo: 'coruja', role: 'Motoristas', equipe: 'Peregrino', responsavel: 'Leonardo Chaves' },
        ] },
        'RJ': { responsavel: 'Lanários - José Alves (Ajudantes) / Peregrino - Leonardo Chaves (Motoristas)', regiao: 'Sudeste', estados: 'MG, RJ', filas: [
            { name: 'Falcon Lanários', tipo: 'falcon', role: 'Ajudantes', equipe: 'Lanários', responsavel: 'José Alves' },
            { name: 'Coruja Lanários', tipo: 'coruja', role: 'Ajudantes', equipe: 'Lanários', responsavel: 'José Alves' },
            { name: 'Falcon Peregrino', tipo: 'falcon', role: 'Motoristas', equipe: 'Peregrino', responsavel: 'Leonardo Chaves' },
            { name: 'Coruja Peregrino', tipo: 'coruja', role: 'Motoristas', equipe: 'Peregrino', responsavel: 'Leonardo Chaves' },
        ] },
        'PR': { responsavel: 'Lanários - José Alves (Ajudantes) / Peregrino - Leonardo Chaves (Motoristas)', regiao: 'Sul', estados: 'PR, RS, SC', filas: [
            { name: 'Falcon Lanários', tipo: 'falcon', role: 'Ajudantes', equipe: 'Lanários', responsavel: 'José Alves' },
            { name: 'Coruja Lanários', tipo: 'coruja', role: 'Ajudantes', equipe: 'Lanários', responsavel: 'José Alves' },
            { name: 'Falcon Peregrino', tipo: 'falcon', role: 'Motoristas', equipe: 'Peregrino', responsavel: 'Leonardo Chaves' },
            { name: 'Coruja Peregrino', tipo: 'coruja', role: 'Motoristas', equipe: 'Peregrino', responsavel: 'Leonardo Chaves' },
        ] },
        'RS': { responsavel: 'Lanários - José Alves (Ajudantes) / Peregrino - Leonardo Chaves (Motoristas)', regiao: 'Sul', estados: 'PR, RS, SC', filas: [
            { name: 'Falcon Lanários', tipo: 'falcon', role: 'Ajudantes', equipe: 'Lanários', responsavel: 'José Alves' },
            { name: 'Coruja Lanários', tipo: 'coruja', role: 'Ajudantes', equipe: 'Lanários', responsavel: 'José Alves' },
            { name: 'Falcon Peregrino', tipo: 'falcon', role: 'Motoristas', equipe: 'Peregrino', responsavel: 'Leonardo Chaves' },
            { name: 'Coruja Peregrino', tipo: 'coruja', role: 'Motoristas', equipe: 'Peregrino', responsavel: 'Leonardo Chaves' },
        ] },
        'SC': { responsavel: 'Lanários - José Alves (Ajudantes) / Peregrino - Leonardo Chaves (Motoristas)', regiao: 'Sul', estados: 'PR, RS, SC', filas: [
            { name: 'Falcon Lanários', tipo: 'falcon', role: 'Ajudantes', equipe: 'Lanários', responsavel: 'José Alves' },
            { name: 'Coruja Lanários', tipo: 'coruja', role: 'Ajudantes', equipe: 'Lanários', responsavel: 'José Alves' },
            { name: 'Falcon Peregrino', tipo: 'falcon', role: 'Motoristas', equipe: 'Peregrino', responsavel: 'Leonardo Chaves' },
            { name: 'Coruja Peregrino', tipo: 'coruja', role: 'Motoristas', equipe: 'Peregrino', responsavel: 'Leonardo Chaves' },
        ] },
        'AL': { responsavel: 'Lanários - José Alves (Ajudantes) / Peregrino - Leonardo Chaves (Motoristas)', regiao: 'Nordeste', estados: 'AL, BA, CE, MA, PB, PE, PI, RN, SE', filas: [
            { name: 'Falcon Lanários', tipo: 'falcon', role: 'Ajudantes', equipe: 'Lanários', responsavel: 'José Alves' },
            { name: 'Coruja Lanários', tipo: 'coruja', role: 'Ajudantes', equipe: 'Lanários', responsavel: 'José Alves' },
            { name: 'Falcon Peregrino', tipo: 'falcon', role: 'Motoristas', equipe: 'Peregrino', responsavel: 'Leonardo Chaves' },
            { name: 'Coruja Peregrino', tipo: 'coruja', role: 'Motoristas', equipe: 'Peregrino', responsavel: 'Leonardo Chaves' },
        ] },
        'BA': { responsavel: 'Lanários - José Alves (Ajudantes) / Peregrino - Leonardo Chaves (Motoristas)', regiao: 'Nordeste', estados: 'AL, BA, CE, MA, PB, PE, PI, RN, SE', filas: [
            { name: 'Falcon Lanários', tipo: 'falcon', role: 'Ajudantes', equipe: 'Lanários', responsavel: 'José Alves' },
            { name: 'Coruja Lanários', tipo: 'coruja', role: 'Ajudantes', equipe: 'Lanários', responsavel: 'José Alves' },
            { name: 'Falcon Peregrino', tipo: 'falcon', role: 'Motoristas', equipe: 'Peregrino', responsavel: 'Leonardo Chaves' },
            { name: 'Coruja Peregrino', tipo: 'coruja', role: 'Motoristas', equipe: 'Peregrino', responsavel: 'Leonardo Chaves' },
        ] },
        'CE': { responsavel: 'Lanários - José Alves (Ajudantes) / Peregrino - Leonardo Chaves (Motoristas)', regiao: 'Nordeste', estados: 'AL, BA, CE, MA, PB, PE, PI, RN, SE', filas: [
            { name: 'Falcon Lanários', tipo: 'falcon', role: 'Ajudantes', equipe: 'Lanários', responsavel: 'José Alves' },
            { name: 'Coruja Lanários', tipo: 'coruja', role: 'Ajudantes', equipe: 'Lanários', responsavel: 'José Alves' },
            { name: 'Falcon Peregrino', tipo: 'falcon', role: 'Motoristas', equipe: 'Peregrino', responsavel: 'Leonardo Chaves' },
            { name: 'Coruja Peregrino', tipo: 'coruja', role: 'Motoristas', equipe: 'Peregrino', responsavel: 'Leonardo Chaves' },
        ] },
        'MA': { responsavel: 'Lanários - José Alves (Ajudantes) / Peregrino - Leonardo Chaves (Motoristas)', regiao: 'Nordeste', estados: 'AL, BA, CE, MA, PB, PE, PI, RN, SE', filas: [
            { name: 'Falcon Lanários', tipo: 'falcon', role: 'Ajudantes', equipe: 'Lanários', responsavel: 'José Alves' },
            { name: 'Coruja Lanários', tipo: 'coruja', role: 'Ajudantes', equipe: 'Lanários', responsavel: 'José Alves' },
            { name: 'Falcon Peregrino', tipo: 'falcon', role: 'Motoristas', equipe: 'Peregrino', responsavel: 'Leonardo Chaves' },
            { name: 'Coruja Peregrino', tipo: 'coruja', role: 'Motoristas', equipe: 'Peregrino', responsavel: 'Leonardo Chaves' },
        ] },
        'PB': { responsavel: 'Lanários - José Alves (Ajudantes) / Peregrino - Leonardo Chaves (Motoristas)', regiao: 'Nordeste', estados: 'AL, BA, CE, MA, PB, PE, PI, RN, SE', filas: [
            { name: 'Falcon Lanários', tipo: 'falcon', role: 'Ajudantes', equipe: 'Lanários', responsavel: 'José Alves' },
            { name: 'Coruja Lanários', tipo: 'coruja', role: 'Ajudantes', equipe: 'Lanários', responsavel: 'José Alves' },
            { name: 'Falcon Peregrino', tipo: 'falcon', role: 'Motoristas', equipe: 'Peregrino', responsavel: 'Leonardo Chaves' },
            { name: 'Coruja Peregrino', tipo: 'coruja', role: 'Motoristas', equipe: 'Peregrino', responsavel: 'Leonardo Chaves' },
        ] },
        'PE': { responsavel: 'Lanários - José Alves (Ajudantes) / Peregrino - Leonardo Chaves (Motoristas)', regiao: 'Nordeste', estados: 'AL, BA, CE, MA, PB, PE, PI, RN, SE', filas: [
            { name: 'Falcon Lanários', tipo: 'falcon', role: 'Ajudantes', equipe: 'Lanários', responsavel: 'José Alves' },
            { name: 'Coruja Lanários', tipo: 'coruja', role: 'Ajudantes', equipe: 'Lanários', responsavel: 'José Alves' },
            { name: 'Falcon Peregrino', tipo: 'falcon', role: 'Motoristas', equipe: 'Peregrino', responsavel: 'Leonardo Chaves' },
            { name: 'Coruja Peregrino', tipo: 'coruja', role: 'Motoristas', equipe: 'Peregrino', responsavel: 'Leonardo Chaves' },
        ] },
        'PI': { responsavel: 'Lanários - José Alves (Ajudantes) / Peregrino - Leonardo Chaves (Motoristas)', regiao: 'Nordeste', estados: 'AL, BA, CE, MA, PB, PE, PI, RN, SE', filas: [
            { name: 'Falcon Lanários', tipo: 'falcon', role: 'Ajudantes', equipe: 'Lanários', responsavel: 'José Alves' },
            { name: 'Coruja Lanários', tipo: 'coruja', role: 'Ajudantes', equipe: 'Lanários', responsavel: 'José Alves' },
            { name: 'Falcon Peregrino', tipo: 'falcon', role: 'Motoristas', equipe: 'Peregrino', responsavel: 'Leonardo Chaves' },
            { name: 'Coruja Peregrino', tipo: 'coruja', role: 'Motoristas', equipe: 'Peregrino', responsavel: 'Leonardo Chaves' },
        ] },
        'RN': { responsavel: 'Lanários - José Alves (Ajudantes) / Peregrino - Leonardo Chaves (Motoristas)', regiao: 'Nordeste', estados: 'AL, BA, CE, MA, PB, PE, PI, RN, SE', filas: [
            { name: 'Falcon Lanários', tipo: 'falcon', role: 'Ajudantes', equipe: 'Lanários', responsavel: 'José Alves' },
            { name: 'Coruja Lanários', tipo: 'coruja', role: 'Ajudantes', equipe: 'Lanários', responsavel: 'José Alves' },
            { name: 'Falcon Peregrino', tipo: 'falcon', role: 'Motoristas', equipe: 'Peregrino', responsavel: 'Leonardo Chaves' },
            { name: 'Coruja Peregrino', tipo: 'coruja', role: 'Motoristas', equipe: 'Peregrino', responsavel: 'Leonardo Chaves' },
        ] },
        'SE': { responsavel: 'Lanários - José Alves (Ajudantes) / Peregrino - Leonardo Chaves (Motoristas)', regiao: 'Nordeste', estados: 'AL, BA, CE, MA, PB, PE, PI, RN, SE', filas: [
            { name: 'Falcon Lanários', tipo: 'falcon', role: 'Ajudantes', equipe: 'Lanários', responsavel: 'José Alves' },
            { name: 'Coruja Lanários', tipo: 'coruja', role: 'Ajudantes', equipe: 'Lanários', responsavel: 'José Alves' },
            { name: 'Falcon Peregrino', tipo: 'falcon', role: 'Motoristas', equipe: 'Peregrino', responsavel: 'Leonardo Chaves' },
            { name: 'Coruja Peregrino', tipo: 'coruja', role: 'Motoristas', equipe: 'Peregrino', responsavel: 'Leonardo Chaves' },
        ] },
    };

    // =============================================
    // ========= LISTAS DINÂMICAS DE EQUIPES =======
    // =============================================
    // Cria listas de UFs para cada equipe dinamicamente a partir das atribuições
    const estadosSacre = [];
    const estadosPeregrino = [];
    const estadosLanario = [];

    for (const uf in atribuicoes) {
        const resp = atribuicoes[uf].responsavel;
        if (resp.includes('Sacre')) {
            estadosSacre.push(uf);
        }
        if (resp.includes('Peregrino')) {
            estadosPeregrino.push(uf);
        }
        if (resp.includes('Lanários')) {
            estadosLanario.push(uf);
        }
    }
    // =============================================
    // =============================================


    const estadosNomes = estadosData.reduce((acc, curr) => {
        acc[curr.uf] = curr.nome;
        return acc;
    }, {});

    function resetAll() {
        const allPaths = document.querySelectorAll('svg path');
        allPaths.forEach(path => {
            path.classList.remove('selected', 'peregrino-map', 'sacre-map', 'lanario-map');
        });
        
        // Remove as classes de cor do card de informações
        dynamicInfoCard.classList.remove('peregrino-card-bg', 'sacre-card-bg', 'lanario-card-bg');

        // Limpa o card de informações e volta ao placeholder
        dynamicInfoCard.innerHTML = '';
        dynamicInfoCard.style.display = 'none';
        tablePlaceholder.style.display = 'block';
        // Remove estado ativo dos botões de legenda
        setActiveButton(null);
    }

    // =============================================
    // ========= FUNÇÃO DOS BOTÕES DE EQUIPE =======
    // =============================================
    // Nova função para destacar todos os estados de uma equipe
    function highlightTeam(equipe) {
        // 1. Limpa o mapa, o card de info e o campo de busca
        resetAll();
        searchInput.value = '';

        const allPaths = document.querySelectorAll('svg path');
        // Define a classe CSS e a lista de UFs com base na equipe selecionada
        let classeMapa = 'peregrino-map';
        let listaEstados = estadosPeregrino;
        if (equipe === 'sacre') {
            classeMapa = 'sacre-map';
            listaEstados = estadosSacre;
        } else if (equipe === 'lanario') {
            classeMapa = 'lanario-map';
            listaEstados = estadosLanario;
        }

        // Itera por todos os 'paths' do SVG
        allPaths.forEach(path => {
            const uf = path.getAttribute("id");
            // Se o ID do path (UF) estiver na lista da equipe, aplica a classe
            if (listaEstados.includes(uf)) {
                path.classList.add(classeMapa);
            }
        });
        // Marcar botão ativo
        setActiveButton(equipe);
    }
    // =============================================
    // =============================================


    function highlightState(uf) {
        resetAll();
        const path = document.getElementById(uf);
        const atribuicao = atribuicoes[uf];
        
        if (path && atribuicao) {
            // Adiciona a classe de cor da equipe e a classe de seleção
            if (atribuicao.responsavel.includes('Sacre')) {
                path.classList.add('sacre-map', 'selected');
                // Adiciona a classe de cor de fundo do card
                dynamicInfoCard.classList.add('sacre-card-bg');
            } else if (atribuicao.responsavel.includes('Peregrino')) {
                path.classList.add('peregrino-map', 'selected');
                // Adiciona a classe de cor de fundo do card
                dynamicInfoCard.classList.add('peregrino-card-bg');
            } else if (atribuicao.responsavel.includes('Lanários')) {
                path.classList.add('lanario-map', 'selected');
                dynamicInfoCard.classList.add('lanario-card-bg');
            }

            // Constrói o HTML dinâmico a partir de filas estruturadas
            // Agrupa filas por role (ex.: 'Motoristas' e 'Ajudantes') e monta uma lista de responsáveis
            const filasByRole = atribuicao.filas.reduce((acc, f) => {
                const role = f.role || 'Motoristas';
                if (!acc[role]) acc[role] = [];
                acc[role].push(f);
                return acc;
            }, {});

            // Mapear responsáveis únicos por combinação equipe+role para exibição separada
            const responsaveisMap = {};
            atribuicao.filas.forEach(f => {
                const key = `${f.equipe || ''}__${f.role || ''}`;
                if (!responsaveisMap[key]) {
                    responsaveisMap[key] = { equipe: f.equipe || '', role: f.role || '', responsavel: f.responsavel || '' };
                }
            });

            // Helper para normalizar o nome da equipe em uma classe CSS conhecida
            function teamClass(equipeName) {
                if (!equipeName) return '';
                const n = equipeName.toLowerCase();
                if (n.includes('lan')) return 'lanario';
                if (n.includes('peregrino')) return 'peregrino';
                if (n.includes('sacre')) return 'sacre';
                // fallback: remove espaços e acentos aproximando a classe
                return n.replace(/[^a-z0-9]/gi, '').replace(/\s+/g, '');
            }

            const responsaveisHtml = Object.values(responsaveisMap).map(r => {
                const cls = teamClass(r.equipe);
                return `<div class="responsavel-line ${cls}">${r.equipe} - ${r.responsavel} (${r.role})</div>`;
            }).join('');

            const motoristasHtml = (filasByRole['Motoristas'] || []).map(f => {
                const cls = teamClass(f.equipe);
                return `<span class="fila-link ${cls}" data-card="${f.tipo}" data-equipe="${f.equipe}" data-role="${f.role}" title="${f.responsavel}">${f.name}</span>`;
            }).join('<br>');

            const ajudantesHtml = (filasByRole['Ajudantes'] || []).map(f => {
                const cls = teamClass(f.equipe);
                return `<span class="fila-link ${cls}" data-card="${f.tipo}" data-equipe="${f.equipe}" data-role="${f.role}" title="${f.responsavel}">${f.name}</span>`;
            }).join('<br>');

            dynamicInfoCard.innerHTML = `
                <div class="info-item">
                    <span class="info-label">Responsável:</span>
                    <div class="info-value">${responsaveisHtml}</div>
                </div>
                <div class="info-item">
                    <span class="info-label">Filas Motoristas:</span>
                    <span class="info-value-filas">${motoristasHtml || '<em>Nenhuma</em>'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Filas Ajudantes:</span>
                    <span class="info-value-filas">${ajudantesHtml || '<em>Nenhuma</em>'}</span>
                </div>
                ${miniCardHtml}
            `;
            
            // Adiciona os eventos de clique APÓS a injeção do HTML
            const filaLinks = document.querySelectorAll('.fila-link');
            const falconDetails = document.getElementById('falcon-details');
            const corujaDetails = document.getElementById('coruja-details');

            // Adiciona evento de clique para os nomes das filas com contador
            filaLinks.forEach(link => {
                link.addEventListener('click', (event) => {
                    const cardType = event.target.dataset.card;
                    if (cardType === 'falcon') {
                        falconClickCount++;
                        if (falconClickCount >= 7) {
                            falconDetails.classList.toggle('expanded');
                            corujaDetails.classList.remove('expanded');
                            falconClickCount = 0; // Reseta o contador
                        }
                    } else if (cardType === 'coruja') {
                        corujaClickCount++;
                        if (corujaClickCount >= 7) {
                            corujaDetails.classList.toggle('expanded');
                            falconDetails.classList.remove('expanded');
                            corujaClickCount = 0; // Reseta o contador
                        }
                    }
                });
            });

            // Adiciona evento de clique para as miniaturas
            document.querySelectorAll('.mini-image').forEach(img => {
                img.addEventListener('click', (event) => {
                    const altText = event.target.alt;
                    if (altText.includes('Falcão')) {
                        openImageCard('img/peregrino.png', 'Falcão Peregrino', 'O Falcão Peregrino é o pássaro mais rápido do mundo!');
                    } else if (altText.includes('Coruja')) {
                        openImageCard('img/coruja.png', 'Coruja', 'A coruja é um animal de hábitos noturnos e com ótima visão.');
                    } else if (altText.includes('Logotipo da Zepon Solutions')) {
                        openImageCard('img/gato.png', 'Gato Solutions', 'Agradecemos por encontrar nosso easter egg!');
                    }
                });
            });

            dynamicInfoCard.style.display = 'block';
            tablePlaceholder.style.display = 'none';
            // Define o botão ativo com base na equipe responsável
            if (atribuicao.responsavel.includes('Sacre')) {
                setActiveButton('sacre');
            } else if (atribuicao.responsavel.includes('Peregrino')) {
                setActiveButton('peregrino');
            } else if (atribuicao.responsavel.includes('Lanários')) {
                setActiveButton('lanario');
            } else {
                setActiveButton(null);
            }
        }
    }

    // Função para controlar o estado visual ativo dos botões de legenda
    function setActiveButton(team) {
        btnSacre.classList.remove('active');
        btnPeregrino.classList.remove('active');
        btnLanario.classList.remove('active');
        // Atualiza atributo aria-pressed para acessibilidade
        btnSacre.setAttribute('aria-pressed', 'false');
        btnPeregrino.setAttribute('aria-pressed', 'false');
        btnLanario.setAttribute('aria-pressed', 'false');
        if (!team) return;
        if (team === 'sacre') {
            btnSacre.classList.add('active');
            btnSacre.setAttribute('aria-pressed', 'true');
        }
        if (team === 'peregrino') {
            btnPeregrino.classList.add('active');
            btnPeregrino.setAttribute('aria-pressed', 'true');
        }
        if (team === 'lanario') {
            btnLanario.classList.add('active');
            btnLanario.setAttribute('aria-pressed', 'true');
        }
    }
    
    // Lógica do mapa
    try {
        const res = await fetch(SVG_FILE);
        if (!res.ok) throw new Error('Não foi possível carregar ' + SVG_FILE);
        const text = await res.text();

        container.innerHTML = text;
        const svg = container.querySelector('svg');
        if (!svg) throw new Error('Arquivo sem tag <svg>.');

        if (!svg.getAttribute('viewBox')) {
            const w = svg.getAttribute('width') || 1000;
            const h = svg.getAttribute('height') || 1000;
            svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
        }

        const paths = Array.from(svg.querySelectorAll('path, polygon, rect'));
        paths.forEach(el => el.removeAttribute("fill"));

        paths.forEach(el => {
            const uf = el.getAttribute("id");
            const nome = estadosNomes[uf] || 'Estado';

            // =============================================
            // ============ HOVER DO MAPA CORRIGIDO ========
            // =============================================
            el.addEventListener('mousemove', (ev) => {
                const atribuicao = atribuicoes[uf];
                if (atribuicao) {
                    tooltip.style.visibility = 'visible';
                    
                    // --- ALTERAÇÃO DO TEXTO DO TOOLTIP ---
                    tooltip.innerText = `${uf} - ${nome}`; 
                    // -------------------------------------

                    tooltip.style.left = (ev.clientX + 12) + 'px';
                    tooltip.style.top = (ev.clientY - 10) + 'px';
                    
                    // Lógica de mudar cor no hover foi REMOVIDA daqui
                    // para corrigir o bug de "apagar" o filtro.
                }
            });

            el.addEventListener('mouseleave', () => {
                tooltip.style.visibility = 'hidden';
                
                // Lógica de mudar cor no hover foi REMOVIDA daqui.
            });
            // =============================================
            // =============================================

            el.addEventListener('click', () => {
                // Lógica do easter egg para o estado do Acre com contador
                if (uf === 'AC') {
                    acreClickCount++;
                    if (acreClickCount >= 7) {
                        openImageCard('img/dino.png', 'Sim! Existem dinossauros no Acre!', 'Parabéns! Você descobriu o segredo dos dinossauros do Acre!');
                        acreClickCount = 0; // Reseta o contador
                    }
                }
                
                highlightState(uf);
                searchInput.value = estadosNomes[uf];
            });
        });

    } catch (err) {
        container.innerHTML = '<div style="padding:20px;background:#fff;border:1px solid #f00;color:#b00">Erro: '+err.message+'</div>';
    }

    // Lógica do campo de pesquisa
    searchInput.addEventListener('input', (event) => {
        const query = event.target.value.toLowerCase().trim();
        
        resetAll();

        if (query === '') {
            return;
        }

        let foundUf = null;
        // Passo 1: Procurar por uma correspondência exata de sigla
        for (const estado of estadosData) {
            if (estado.uf.toLowerCase() === query) {
                foundUf = estado.uf;
                break;
            }
        }

        // Passo 2: Se não houver correspondência exata, procurar por nome
        if (!foundUf) {
            for (const estado of estadosData) {
                if (estado.nome.toLowerCase().includes(query)) {
                    foundUf = estado.uf;
                    break;
                }
            }
        }
        
        if (foundUf) {
            highlightState(foundUf);
        }
    });
    
    // Lógica do botão de limpar
    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        resetAll();
    });

    // =============================================
    // ========= EVENTOS DOS BOTÕES DE EQUIPE ======
    // =============================================
    // Adiciona os eventos de clique aos botões de equipe (com comportamento toggle)
    btnSacre.addEventListener('click', () => {
        // Se já estiver ativo, desativa tudo; caso contrário ativa a equipe
        if (btnSacre.classList.contains('active')) {
            resetAll();
        } else {
            highlightTeam('sacre');
        }
    });

    btnPeregrino.addEventListener('click', () => {
        if (btnPeregrino.classList.contains('active')) {
            resetAll();
        } else {
            highlightTeam('peregrino');
        }
    });
    
    btnLanario.addEventListener('click', () => {
        if (btnLanario.classList.contains('active')) {
            resetAll();
        } else {
            highlightTeam('lanario');
        }
    });
    // =============================================
    // =============================================

    // Ajusta a altura do container (`body > .container`) com base nas alturas do header e footer
    function adjustContainerHeight() {
        const header = document.querySelector('header');
        const footer = document.querySelector('footer');
        const outerContainer = document.querySelector('body > .container');
        if (!outerContainer) return;
        const headerH = header ? header.getBoundingClientRect().height : 0;
        const footerH = footer ? footer.getBoundingClientRect().height : 0;
        const available = Math.max(0, window.innerHeight - headerH - footerH);
        // Use height to lock the container to the available space; JS will override CSS fallback
        outerContainer.style.height = available + 'px';
        outerContainer.style.maxHeight = 'none';
        outerContainer.style.overflowY = 'auto';
    }

    // Debounce simples para evitar múltiplos cálculos durante resize (200ms por padrão)
    const debounce = (fn, wait = 200) => {
        let t;
        return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
    };

    // Atualiza em eventos relevantes
    window.addEventListener('resize', debounce(adjustContainerHeight, 200));
    window.addEventListener('orientationchange', debounce(adjustContainerHeight, 200));
    window.addEventListener('load', adjustContainerHeight);
    document.addEventListener('readystatechange', () => { if (document.readyState === 'complete') adjustContainerHeight(); });

})();
