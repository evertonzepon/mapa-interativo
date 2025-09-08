
        (async function(){
            const container = document.getElementById('svg-container');
            const tooltip = document.getElementById('map-tooltip');
            const searchInput = document.getElementById('filtro-estado');
            const clearBtn = document.getElementById('limpar-filtro-btn');
            const dynamicInfoCard = document.getElementById('dynamic-info-card');
            const tablePlaceholder = document.getElementById('table-placeholder');
            const SVG_FILE = 'img/brazil-states.svg';
            
            // Novos elementos do dialog
            const dialog = document.getElementById('info-dialog');
            const closeBtn = document.getElementById('close-dialog-btn');
            const mainContentWrapper = document.querySelector('.main-content-wrapper');

            // Exibe o dialog na entrada do site
            dialog.showModal();

            // Ao clicar no botão, fecha o dialog e exibe o conteúdo principal
            closeBtn.addEventListener('click', () => {
                dialog.close();
                mainContentWrapper.style.display = 'flex';
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
            const atribuicoes = {
                'AC': { responsavel: 'Peregrino - Leonardo Chaves', regiao: 'Norte', estados: 'AC, AP, AM, PA, RO, RR', filas: 'Falcon Peregrino<br>Coruja Peregrino' },
                'AP': { responsavel: 'Peregrino - Leonardo Chaves', regiao: 'Norte', estados: 'AC, AP, AM, PA, RO, RR', filas: 'Falcon Peregrino<br>Coruja Peregrino' },
                'AM': { responsavel: 'Peregrino - Leonardo Chaves', regiao: 'Norte', estados: 'AC, AP, AM, PA, RO, RR', filas: 'Falcon Peregrino<br>Coruja Peregrino' },
                'PA': { responsavel: 'Peregrino - Leonardo Chaves', regiao: 'Norte', estados: 'AC, AP, AM, PA, RO, RR', filas: 'Falcon Peregrino<br>Coruja Peregrino' },
                'RO': { responsavel: 'Peregrino - Leonardo Chaves', regiao: 'Norte', estados: 'AC, AP, AM, PA, RO, RR', filas: 'Falcon Peregrino<br>Coruja Peregrino' },
                'RR': { responsavel: 'Peregrino - Leonardo Chaves', regiao: 'Norte', estados: 'AC, AP, AM, PA, RO, RR', filas: 'Falcon Peregrino<br>Coruja Peregrino' },
                'TO': { responsavel: 'Sacre - Alexandre Donegá', regiao: 'Norte', estados: 'TO', filas: 'Falcon Sacre<br>Coruja Sacre' },
                'GO': { responsavel: 'Peregrino - Leonardo Chaves', regiao: 'Centro-Oeste', estados: 'GO, MS, DF', filas: 'Falcon Peregrino<br>Coruja Peregrino' },
                'MS': { responsavel: 'Peregrino - Leonardo Chaves', regiao: 'Centro-Oeste', estados: 'GO, MS, DF', filas: 'Falcon Peregrino<br>Coruja Peregrino' },
                'DF': { responsavel: 'Peregrino - Leonardo Chaves', regiao: 'Centro-Oeste', estados: 'GO, MS, DF', filas: 'Falcon Peregrino<br>Coruja Peregrino' },
                'MT': { responsavel: 'Sacre - Alexandre Donegá', regiao: 'Centro-Oeste', estados: 'MT', filas: 'Falcon Sacre<br>Coruja Sacre' },
                'ES': { responsavel: 'Sacre - Alexandre Donegá', regiao: 'Sudeste', estados: 'ES, SP', filas: 'Falcon Sacre<br>Coruja Sacre' },
                'SP': { responsavel: 'Sacre - Alexandre Donegá', regiao: 'Sudeste', estados: 'ES, SP', filas: 'Falcon Sacre<br>Coruja Sacre' },
                'MG': { responsavel: 'Peregrino - Leonardo Chaves', regiao: 'Sudeste', estados: 'MG, RJ', filas: 'Falcon Peregrino<br>Coruja Peregrino' },
                'RJ': { responsavel: 'Peregrino - Leonardo Chaves', regiao: 'Sudeste', estados: 'MG, RJ', filas: 'Falcon Peregrino<br>Coruja Peregrino' },
                'PR': { responsavel: 'Peregrino - Leonardo Chaves', regiao: 'Sul', estados: 'PR, RS, SC', filas: 'Falcon Peregrino<br>Coruja Peregrino' },
                'RS': { responsavel: 'Peregrino - Leonardo Chaves', regiao: 'Sul', estados: 'PR, RS, SC', filas: 'Falcon Peregrino<br>Coruja Peregrino' },
                'SC': { responsavel: 'Peregrino - Leonardo Chaves', regiao: 'Sul', estados: 'PR, RS, SC', filas: 'Falcon Peregrino<br>Coruja Peregrino' },
                'AL': { responsavel: 'Sacre - Alexandre Donegá', regiao: 'Nordeste', estados: 'AL, BA, CE, MA, PB, PE, PI, RN, SE', filas: 'Falcon Sacre<br>Coruja Sacre' },
                'BA': { responsavel: 'Sacre - Alexandre Donegá', regiao: 'Nordeste', estados: 'AL, BA, CE, MA, PB, PE, PI, RN, SE', filas: 'Falcon Sacre<br>Coruja Sacre' },
                'CE': { responsavel: 'Sacre - Alexandre Donegá', regiao: 'Nordeste', estados: 'AL, BA, CE, MA, PB, PE, PI, RN, SE', filas: 'Falcon Sacre<br>Coruja Sacre' },
                'MA': { responsavel: 'Sacre - Alexandre Donegá', regiao: 'Nordeste', estados: 'AL, BA, CE, MA, PB, PE, PI, RN, SE', filas: 'Falcon Sacre<br>Coruja Sacre' },
                'PB': { responsavel: 'Sacre - Alexandre Donegá', regiao: 'Nordeste', estados: 'AL, BA, CE, MA, PB, PE, PI, RN, SE', filas: 'Falcon Sacre<br>Coruja Sacre' },
                'PE': { responsavel: 'Sacre - Alexandre Donegá', regiao: 'Nordeste', estados: 'AL, BA, CE, MA, PB, PE, PI, RN, SE', filas: 'Falcon Sacre<br>Coruja Sacre' },
                'PI': { responsavel: 'Sacre - Alexandre Donegá', regiao: 'Nordeste', estados: 'AL, BA, CE, MA, PB, PE, PI, RN, SE', filas: 'Falcon Sacre<br>Coruja Sacre' },
                'RN': { responsavel: 'Sacre - Alexandre Donegá', regiao: 'Nordeste', estados: 'AL, BA, CE, MA, PB, PE, PI, RN, SE', filas: 'Falcon Sacre<br>Coruja Sacre' },
                'SE': { responsavel: 'Sacre - Alexandre Donegá', regiao: 'Nordeste', estados: 'AL, BA, CE, MA, PB, PE, PI, RN, SE', filas: 'Falcon Sacre<br>Coruja Sacre' },
            };

            const estadosNomes = estadosData.reduce((acc, curr) => {
                acc[curr.uf] = curr.nome;
                return acc;
            }, {});

            function resetAll() {
                const allPaths = document.querySelectorAll('svg path');
                allPaths.forEach(path => {
                    path.classList.remove('selected', 'peregrino-map', 'sacre-map');
                });
                
                // Limpa o card de informações e volta ao placeholder
                dynamicInfoCard.innerHTML = '';
                dynamicInfoCard.style.display = 'none';
                tablePlaceholder.style.display = 'block';
            }

            function highlightState(uf) {
                resetAll();
                const path = document.getElementById(uf);
                const atribuicao = atribuicoes[uf];
                
                if (path && atribuicao) {
                    // Adiciona a classe de cor da equipe e a classe de seleção
                    if (atribuicao.responsavel.includes('Peregrino')) {
                        path.classList.add('peregrino-map', 'selected');
                    } else {
                        path.classList.add('sacre-map', 'selected');
                    }

                    // Preenche o card de informações
                    dynamicInfoCard.innerHTML = `
                        <div class="info-item">
                            <span class="info-label">Responsável:</span>
                            <span class="info-value">${atribuicao.responsavel}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Região:</span>
                            <span class="info-value">${atribuicao.regiao}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Estados:</span>
                            <span class="info-value">${atribuicao.estados}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Filas:</span>
                            <span class="info-value-filas">${atribuicao.filas}</span>
                        </div>
                    `;
                    dynamicInfoCard.style.display = 'block';
                    tablePlaceholder.style.display = 'none';
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

                    el.addEventListener('mousemove', (ev) => {
                        const atribuicao = atribuicoes[uf];
                        if (atribuicao) {
                            tooltip.style.visibility = 'visible';
                            tooltip.innerText = atribuicao.responsavel;
                            tooltip.style.left = (ev.clientX + 12) + 'px';
                            tooltip.style.top = (ev.clientY - 10) + 'px';

                            // Apenas adiciona a cor de hover se não estiver selecionado
                            if (!el.classList.contains('selected')) {
                                if (atribuicao.responsavel.includes('Peregrino')) {
                                    el.classList.add('peregrino-map');
                                } else {
                                    el.classList.add('sacre-map');
                                }
                            }
                        }
                    });

                    el.addEventListener('mouseleave', () => {
                        tooltip.style.visibility = 'hidden';
                        // Remove a cor de hover apenas se não estiver selecionado
                        if (!el.classList.contains('selected')) {
                            el.classList.remove('peregrino-map', 'sacre-map');
                        }
                    });

                    el.addEventListener('click', () => {
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
        })();