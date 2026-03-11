(function () {
    'use strict';
    document.addEventListener('DOMContentLoaded', init);

    // Scroll to top on page load/refresh
    window.addEventListener('beforeunload', function () {
        window.scrollTo(0, 0);
    });

    function init() {
        window.scrollTo(0, 0);
        if (window.lucide) lucide.createIcons();
        setupHeader();
        setupMobileNav();
        setupCounters();
        setupScrollReveal();
        setupContactForm();
        setupSmoothScroll();
        setupThemeToggle();
        setupLanguageToggle();
        setupArticleTOC();
        setupChatbot();
    }

    function setupHeader() {
        var header = document.getElementById('header');
        if (!header) return;
        var update = function () {
            header.classList.toggle('scrolled', window.scrollY > 60);
        };
        window.addEventListener('scroll', update, { passive: true });
        update();
    }

    function setupMobileNav() {
        var toggle = document.getElementById('nav-toggle');
        var menu = document.getElementById('nav-menu');
        if (!toggle || !menu) return;

        // Build sidebar header (logo + brand name + close button)
        if (!menu.querySelector('.sidebar-header')) {
            var sidebarHeader = document.createElement('div');
            sidebarHeader.className = 'sidebar-header';

            var logoImg = document.querySelector('.logo-img');
            var brand = document.createElement('div');
            brand.className = 'sidebar-header-brand';
            brand.innerHTML = '<img src="' + (logoImg ? logoImg.src : 'ICONE CGC.jpg') + '" alt="Logo">' +
                '<span>Copia Group</span>';

            var closeBtn = document.createElement('button');
            closeBtn.className = 'sidebar-close';
            closeBtn.setAttribute('aria-label', 'Fechar menu');
            closeBtn.innerHTML = '<i data-lucide="x" width="20" height="20"></i>';

            sidebarHeader.appendChild(brand);
            sidebarHeader.appendChild(closeBtn);
            menu.insertBefore(sidebarHeader, menu.firstChild);
        }

        // Update sidebar footer with email + CTA
        var footer = menu.querySelector('.header__menu-footer');
        if (footer && !footer.querySelector('.sidebar-email')) {
            var emailLink = document.createElement('a');
            emailLink.className = 'sidebar-email';
            emailLink.href = 'mailto:info@copiagroup.co.mz';
            emailLink.textContent = 'Email';
            footer.insertBefore(emailLink, footer.firstChild);

            var cta = footer.querySelector('.btn-nav-cta');
            if (cta) {
                cta.textContent = 'Contacte-nos';
            }
        }

        if (window.lucide) lucide.createIcons();

        var closeBtn = menu.querySelector('.sidebar-close');

        // Create overlay element inside header (same stacking context as sidebar)
        var header = document.getElementById('header');
        var overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        if (header) {
            header.appendChild(overlay);
        } else {
            document.body.appendChild(overlay);
        }

        function openNav() {
            menu.classList.add('active');
            toggle.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        function closeNav() {
            menu.classList.remove('active');
            toggle.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        toggle.addEventListener('click', function () {
            if (menu.classList.contains('active')) {
                closeNav();
            } else {
                openNav();
            }
        });
        if (closeBtn) closeBtn.addEventListener('click', closeNav);
        overlay.addEventListener('click', closeNav);

        // Nav links: close sidebar + navigate
        menu.querySelectorAll('.nav-link').forEach(function (link) {
            link.addEventListener('click', function (e) {
                var href = link.getAttribute('href') || '';
                var hashIndex = href.indexOf('#');
                var hash = hashIndex !== -1 ? href.substring(hashIndex) : '';
                var target = hash && hash !== '#' ? document.querySelector(hash) : null;

                closeNav();

                if (target) {
                    e.preventDefault();
                    setTimeout(function () {
                        window.scrollTo({
                            top: target.getBoundingClientRect().top + window.scrollY - 80,
                            behavior: 'smooth'
                        });
                    }, 400);
                }
            });
        });
    }

    function setupCounters() {
        const els = document.querySelectorAll('[data-target]');
        if (!els.length) return;
        let done = false;
        const run = () => {
            if (done) return;
            const section = document.querySelector('.stats-grid');
            if (!section) return;
            const r = section.getBoundingClientRect();
            if (r.top > window.innerHeight || r.bottom < 0) return;
            done = true;
            els.forEach(el => {
                const target = parseInt(el.dataset.target, 10);
                const dur = 2000;
                const start = performance.now();
                const step = (now) => {
                    const t = Math.min((now - start) / dur, 1);
                    const ease = 1 - Math.pow(1 - t, 4);
                    el.textContent = Math.round(target * ease);
                    if (t < 1) requestAnimationFrame(step);
                };
                requestAnimationFrame(step);
            });
        };
        window.addEventListener('scroll', run, { passive: true });
        run();
    }

    function setupScrollReveal() {
        var selectors = [
            '.section-header', '.section-subtitle', '.section-text',
            '.stat-card', '.area-card', '.software-card',
            '.service-card', '.team-card', '.blog-card', '.contact-item',
            '.contact-form', '.hero-title', '.hero-description',
            '.hero-actions'
        ].join(',');
        var elements = document.querySelectorAll(selectors);
        if (!elements.length) return;
        elements.forEach(function (el) { el.classList.add('fade-in'); });

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var parent = entry.target.parentElement;
                    var siblings = parent ? Array.from(parent.children).filter(function (c) {
                        return c.classList.contains('fade-in');
                    }) : [];
                    var idx = siblings.indexOf(entry.target);
                    entry.target.style.transitionDelay = (idx > 0 ? idx * 100 : 0) + 'ms';
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.05, rootMargin: '0px 0px -60px 0px' });

        elements.forEach(function (el) { observer.observe(el); });
    }

    function setupContactForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            if (!btn || btn.disabled) return;
            const orig = btn.innerHTML;
            const lang = document.documentElement.lang || 'pt';
            const msg = lang === 'en' ? 'Message Sent!' : 'Mensagem Enviada!';
            btn.disabled = true;
            btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> ' + msg;
            btn.style.background = '#2E7D32';
            setTimeout(() => {
                btn.innerHTML = orig;
                btn.style.background = '';
                btn.disabled = false;
                form.reset();
            }, 3500);
        });
    }

    function setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (a) {
            // Skip links inside mobile sidebar (handled by setupMobileNav)
            if (a.closest('#nav-menu')) return;
            a.addEventListener('click', function (e) {
                var id = this.getAttribute('href');
                if (id === '#') return;
                var t = document.querySelector(id);
                if (!t) return;
                e.preventDefault();
                t.scrollIntoView({ behavior: 'smooth' });
            });
        });
    }

    /* ── Article TOC Sidebar ── */

    function setupArticleTOC() {
        var articleBody = document.querySelector('.article-body');
        if (!articleBody) return;

        var headings = articleBody.querySelectorAll('h2, h3');
        if (headings.length < 2) return;

        // Ensure headings have IDs
        headings.forEach(function (h, i) {
            if (!h.id) h.id = 'section-' + i;
        });

        // Create FAB button
        var fab = document.createElement('button');
        fab.className = 'toc-fab';
        fab.setAttribute('aria-label', 'Índice');
        fab.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="12" y2="18"/></svg>';

        // Create overlay
        var overlay = document.createElement('div');
        overlay.className = 'toc-overlay';

        // Create sidebar
        var sidebar = document.createElement('div');
        sidebar.className = 'toc-sidebar';

        var headerDiv = document.createElement('div');
        headerDiv.className = 'toc-sidebar__header';
        headerDiv.innerHTML = '<span class="toc-sidebar__title">Índice</span>' +
            '<button class="toc-sidebar__close" aria-label="Fechar">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
            '</button>';

        var list = document.createElement('ul');
        list.className = 'toc-sidebar__list';
        var h2Count = 0;

        headings.forEach(function (h) {
            var li = document.createElement('li');
            var a = document.createElement('a');
            a.className = 'toc-sidebar__link';
            a.href = '#' + h.id;

            if (h.tagName === 'H2') {
                h2Count++;
                var num = document.createElement('span');
                num.className = 'toc-sidebar__num';
                num.textContent = h2Count;
                a.appendChild(num);
            } else {
                a.classList.add('toc-sidebar__link--sub');
            }

            var text = document.createElement('span');
            text.textContent = h.textContent;
            a.appendChild(text);
            li.appendChild(a);
            list.appendChild(li);
        });

        var progressDiv = document.createElement('div');
        progressDiv.className = 'toc-sidebar__progress';
        progressDiv.innerHTML = '<div class="toc-sidebar__progress-bar"></div>';

        sidebar.appendChild(headerDiv);
        sidebar.appendChild(list);
        sidebar.appendChild(progressDiv);

        document.body.appendChild(fab);
        document.body.appendChild(overlay);
        document.body.appendChild(sidebar);

        var progressBar = progressDiv.querySelector('.toc-sidebar__progress-bar');

        // Open/close
        function openTOC() {
            sidebar.classList.add('active');
            overlay.classList.add('active');
            overlay.style.display = 'block';
            document.body.style.overflow = 'hidden';
            requestAnimationFrame(function () {
                overlay.classList.add('active');
            });
        }
        function closeTOC() {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
            setTimeout(function () {
                overlay.style.display = 'none';
            }, 350);
        }

        fab.addEventListener('click', openTOC);
        overlay.addEventListener('click', closeTOC);
        headerDiv.querySelector('.toc-sidebar__close').addEventListener('click', closeTOC);

        // Click on TOC link
        list.querySelectorAll('.toc-sidebar__link').forEach(function (link) {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                var targetId = this.getAttribute('href').slice(1);
                var target = document.getElementById(targetId);
                if (target) {
                    closeTOC();
                    setTimeout(function () {
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                }
            });
        });

        // Scroll spy: highlight current section & update progress
        var tocLinks = list.querySelectorAll('.toc-sidebar__link');
        var headingArr = Array.from(headings);

        function updateActive() {
            var scrollPos = window.scrollY + 120;
            var current = null;

            for (var i = headingArr.length - 1; i >= 0; i--) {
                if (headingArr[i].offsetTop <= scrollPos) {
                    current = headingArr[i];
                    break;
                }
            }

            tocLinks.forEach(function (link) {
                var linkId = link.getAttribute('href').slice(1);
                link.classList.toggle('active', current && current.id === linkId);
            });

            // Progress
            var docHeight = document.documentElement.scrollHeight - window.innerHeight;
            var progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
            progressBar.style.width = Math.min(progress, 100) + '%';
        }

        window.addEventListener('scroll', updateActive, { passive: true });
        updateActive();
    }

    /* ── Theme Toggle (Dark / Light) ── */

    function setupThemeToggle() {
        var btn = document.getElementById('theme-toggle');
        if (!btn) return;

        // Restore saved theme
        var saved = localStorage.getItem('dpdt-theme');
        if (saved === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        }

        btn.addEventListener('click', function () {
            var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            if (isDark) {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('dpdt-theme', 'light');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('dpdt-theme', 'dark');
            }
        });
    }

    /* ── Language Toggle (PT ↔ EN) ── */

    var translations = {
        pt: {
            'nav.home': 'Início',
            'nav.about': 'Sobre',
            'nav.areas': 'Áreas',
            'nav.services': 'Serviços',
            'nav.team': 'Equipa',
            'nav.contact': 'Contacto',

            'hero.title': 'Pesquisa, Desenvolvimento e<br><span class="gold-text">Tecnologia</span>',
            'hero.desc': 'Departamento de inovação da Copia Group of Companies, SA. Tecnologia avançada em inteligência artificial e machine learning para interpretação sísmica, simulação de reservatórios e soluções para o sector de petróleo, gás e biocombustíveis.',
            'hero.btn1': 'Explorar Softwares',
            'hero.btn2': 'Fale Connosco',

            'about.title': 'Sobre o <span class="underline-gold">DPDT</span>',
            'about.subtitle': 'Departamento de Pesquisa, Desenvolvimento e Tecnologia da Copia Group of Companies, SA',
            'about.text': 'O DPDT é a unidade estratégica de inovação do grupo, especializada no desenvolvimento de software avançado que utiliza inteligência artificial e machine learning para resolver desafios complexos na exploração e produção de petróleo e gás. As nossas soluções são projectadas para melhorar a eficiência, reduzir custos e aumentar as taxas de sucesso.',
            'stats.accuracy': 'Taxa de Precisão',
            'stats.processing': 'Redução do Tempo de Processamento',
            'stats.ai': 'Soluções Integradas com IA',

            'areas.title': 'Áreas de <span class="underline-gold">Actuação</span>',
            'areas.subtitle': 'Os três pilares estratégicos do DPDT no sector energético',
            'areas.oil.title': 'Petróleo',
            'areas.oil.desc': 'Pesquisa e desenvolvimento de tecnologias para exploração, produção e refino. Análise de reservatórios, controlo de qualidade e optimização de processos de extracção.',
            'areas.oil.f1': 'Análise e caracterização de reservatórios',
            'areas.oil.f2': 'Optimização de processos de produção',
            'areas.oil.f3': 'Controlo de qualidade de derivados',
            'areas.oil.f4': 'Tecnologias de recuperação avançada',
            'areas.gas.title': 'Gás Natural',
            'areas.gas.desc': 'Investigação em processamento, transporte e utilização de gás natural. Tecnologias de liquefacção (GNL), compressão (GNC) e aproveitamento energético.',
            'areas.gas.f1': 'Processamento e tratamento de gás',
            'areas.gas.f2': 'Tecnologias de liquefacção (GNL)',
            'areas.gas.f3': 'Monitoramento de gasodutos',
            'areas.gas.f4': 'Conversão e aproveitamento energético',
            'areas.bio.title': 'Biocombustíveis',
            'areas.bio.desc': 'Combustíveis renováveis a partir de fontes biológicas. Investigação em bioetanol, biodiesel e biogás com foco na sustentabilidade e transição energética.',
            'areas.bio.f1': 'Produção de bioetanol e biodiesel',
            'areas.bio.f2': 'Tecnologias de conversão de biomassa',
            'areas.bio.f3': 'Biogás e digestão anaeróbia',
            'areas.bio.f4': 'Análise de ciclo de vida',

            'sw.title': 'Os Nossos <span class="underline-gold">Softwares</span>',
            'sw.subtitle': 'Soluções de software de ponta para a indústria de petróleo e gás',
            'sw.text': 'Na COPIA, especializamo-nos no desenvolvimento de software avançado que utiliza inteligência artificial e machine learning para resolver desafios complexos na exploração e produção de petróleo e gás. As nossas soluções são projectadas para melhorar a eficiência, reduzir custos e aumentar as taxas de sucesso.',
            'sw.dl.subtitle': 'Plataforma Integrada de Engenharia, Geociências e Construção Civil',
            'sw.dl.desc': 'O COPIA Digital Lab integra dados geoespaciais e de engenharia num ambiente tridimensional unificado, abrangendo desde o planeamento de levantamentos sísmicos e modelação geológica até à gestão de obras de construção civil, fiscalização, controlo de qualidade e sustentabilidade. Com recurso a inteligência artificial e aprendizagem automática, automatiza a otimização de geometrias de aquisição, prevê custos e prazos, avalia riscos ambientais, monitoriza a conformidade normativa e gera relatórios de qualidade e impacto ambiental.',
            'sw.dl.f1': 'Visualização 3D interactiva e modelação geológica',
            'sw.dl.f2': 'Planeamento de levantamentos sísmicos com IA',
            'sw.dl.f3': 'Análise geoespacial e dashboards em tempo real',
            'sw.dl.f4': 'Previsão de custos, prazos e avaliação de riscos',
            'sw.dl.f5': 'Gestão de obras e fiscalização de construção civil',
            'sw.dl.f6': 'Controlo de qualidade e conformidade normativa',
            'sw.dl.f7': 'Relatórios de impacto ambiental e sustentabilidade',
            'sw.dl.f8': 'Arquitectura multi-serviço integrada',
            'sw.co.subtitle': 'Colector de Coordenadas GPS com Mapeamento Integrado',
            'sw.co.desc': 'O COPIA Colect é uma aplicação PWA instalável para colecta de coordenadas GPS com mapa interactivo. Ideal para topografia, demarcação de terrenos, mapeamento de campo e registo de trajetos. Funciona offline, com exportação em múltiplos formatos e tema claro/escuro.',
            'sw.co.f1': 'Localização GPS com precisão em metros',
            'sw.co.f2': 'Colecta de pontos com legenda, categoria, cor e foto',
            'sw.co.f3': 'Rastreamento contínuo de trajetos',
            'sw.co.f4': 'Medição de distâncias e cálculo de áreas',
            'sw.co.f5': 'Perfil de elevação com gráfico de relevo',
            'sw.co.f6': 'Exportação em JSON, GPX e KML (Google Earth)',
            'sw.co.f7': 'App instalável (PWA) — funciona offline',
            'sw.co.f8': 'Múltiplos projectos e partilha por link',

            'svc.title': 'Serviços e <span class="underline-gold">Competências</span>',
            'svc.subtitle': 'O DPDT oferece serviços que vão da pesquisa laboratorial ao desenvolvimento de software especializado',
            'svc.s1.title': 'Pesquisa & Investigação',
            'svc.s1.desc': 'Estudos de viabilidade, análise laboratorial, caracterização de materiais e investigação científica aplicada.',
            'svc.s2.title': 'Engenharia de Processos',
            'svc.s2.desc': 'Optimização de processos industriais, simulação, scale-up e implementação de melhorias operacionais.',
            'svc.s3.title': 'Soluções Digitais',
            'svc.s3.desc': 'Software especializado, sistemas SCADA, IoT industrial, plataformas de monitoramento e automação.',
            'svc.s4.title': 'Segurança & Ambiente',
            'svc.s4.desc': 'Gestão HSE, estudos de impacto ambiental, análise de riscos e conformidade regulatória.',
            'svc.s5.title': 'Análise de Dados & IA',
            'svc.s5.desc': 'Data science, modelos preditivos, machine learning para optimização de reservatórios e processos.',
            'svc.s6.title': 'Consultoria Técnica',
            'svc.s6.desc': 'Assessoria especializada, transferência de tecnologia, formação de equipas e auditorias técnicas.',

            'team.title': 'Nossa <span class="underline-gold">Equipa</span>',
            'team.subtitle': 'Profissionais multidisciplinares dedicados à inovação no sector energético',
            'team.t1.name': 'Director do DPDT',
            'team.t1.role': 'Head of R&D',
            'team.t2.name': 'Eng. de Petróleo',
            'team.t2.role': 'Petroleum Engineer',
            'team.t3.name': 'Eng. Químico',
            'team.t3.role': 'Chemical Engineer',
            'team.t4.name': 'Líder de Tecnologia',
            'team.t4.role': 'Technology Lead',

            'nav.blog': 'Blog',

            'blog.title': 'Artigos <span class="underline-gold">Científicos</span>',
            'blog.subtitle': 'Publicações e estudos do DPDT nas áreas de inteligência artificial, petrofísica e geociências',
            'blog.a1.title': 'PINNs em Petrofísica: A Integração entre Deep Learning e Equações de Rocha',
            'blog.a1.desc': 'Estudo crítico sobre Physics-Informed Neural Networks aplicadas à previsão de porosidade em formações petrolíferas, comparando modelos de física pura, redes neurais e abordagens híbridas.',
            'blog.a1.date': '21 Dez 2024',
            'blog.a2.title': 'Integração de Métodos Convencionais e Machine Learning para Caracterização Petrofísica de Sistemas Fluviais',
            'blog.a2.desc': 'Estudo comparativo multi-escala entre métodos convencionais e de Machine Learning para caracterização de fácies em sistemas deposicionais fluviais, com F1-Score de 0.87.',
            'blog.a2.date': '28 Dez 2025',
            'blog.a3.title': 'Machine Learning e Atributos Sísmicos para Modelagem Estrutural 3D Automatizada',
            'blog.a3.desc': 'Integração de processamento de sinais clássico com Machine Learning para modelagem estrutural automatizada em reservatórios petrolíferos, utilizando detecção de horizontes e interpolação RBF.',
            'blog.a3.date': '29 Dez 2025',
            'blog.a3.badge': 'Sísmica \u00B7 Modelagem 3D',
            'blog.tag.petro': 'Petrofísica',
            'blog.tag.porosity': 'Porosidade',
            'blog.tag.reservoir': 'Reservatórios',
            'blog.tag.fluvial': 'Sistemas Fluviais',
            'blog.tag.seismic': 'Sísmica',
            'blog.tag.3d': 'Modelagem 3D',
            'footer.blog': 'Blog',

            'cta.title': 'Pronto para Transformar as Suas Operações?',
            'cta.desc': 'Contacte-nos para saber como as nossas soluções de software podem melhorar a eficiência da sua exploração e produção.',
            'cta.btn1': 'Fale Connosco',
            'cta.btn2': 'Explorar Softwares',

            'contact.title': 'Fale <span class="underline-gold">Connosco</span>',
            'contact.subtitle': 'Tem um projecto ou precisa de suporte técnico? A equipa DPDT está disponível.',
            'contact.email': 'Email',
            'contact.phone': 'Telefone',
            'contact.location': 'Localização',

            'form.name': 'Nome completo',
            'form.email': 'Email',
            'form.company': 'Empresa / Instituição',
            'form.select': 'Selecione o assunto',
            'form.opt1': 'Projecto de Pesquisa',
            'form.opt2': 'Consultoria Técnica',
            'form.opt3': 'Software Solutions',
            'form.opt4': 'Parceria / Colaboração',
            'form.opt5': 'Oportunidades de Carreira',
            'form.opt6': 'Outro Assunto',
            'form.message': 'A sua mensagem...',
            'form.submit': 'Enviar Mensagem',

            'news.title': 'Receba as Nossas Novidades',
            'news.desc': 'Subscreva para receber actualizações sobre os nossos projectos e iniciativas',
            'news.placeholder': 'O seu endereço de email',
            'news.btn': 'Subscrever',

            'footer.desc': 'Departamento de Pesquisa, Desenvolvimento e Tecnologia. Inovação em petróleo, gás natural e biocombustíveis.',
            'footer.nav': 'Navegação',
            'footer.about': 'Sobre o DPDT',
            'footer.areas': 'Áreas de Actuação',
            'footer.services': 'Serviços',
            'footer.company': 'Empresa',
            'footer.team': 'Equipa',
            'footer.contact': 'Contacto',
            'footer.copy': '\u00A9 2026 DPDT - Copia Group of Companies, SA. Todos os direitos reservados.'
        },
        en: {
            'nav.home': 'Home',
            'nav.about': 'About',
            'nav.areas': 'Areas',
            'nav.services': 'Services',
            'nav.team': 'Team',
            'nav.contact': 'Contact',

            'hero.title': 'Research, Development &<br><span class="gold-text">Technology</span>',
            'hero.desc': 'Innovation department of Copia Group of Companies, SA. Advanced technology in artificial intelligence and machine learning for seismic interpretation, reservoir simulation and solutions for the oil, gas and biofuels sector.',
            'hero.btn1': 'Explore Software',
            'hero.btn2': 'Contact Us',

            'about.title': 'About <span class="underline-gold">DPDT</span>',
            'about.subtitle': 'Research, Development and Technology Department of Copia Group of Companies, SA',
            'about.text': 'DPDT is the strategic innovation unit of the group, specializing in the development of advanced software that uses artificial intelligence and machine learning to solve complex challenges in oil and gas exploration and production. Our solutions are designed to improve efficiency, reduce costs and increase success rates.',
            'stats.accuracy': 'Accuracy Rate',
            'stats.processing': 'Processing Time Reduction',
            'stats.ai': 'AI-Integrated Solutions',

            'areas.title': 'Areas of <span class="underline-gold">Operation</span>',
            'areas.subtitle': 'The three strategic pillars of DPDT in the energy sector',
            'areas.oil.title': 'Petroleum',
            'areas.oil.desc': 'Research and development of technologies for exploration, production and refining. Reservoir analysis, quality control and optimization of extraction processes.',
            'areas.oil.f1': 'Reservoir analysis and characterization',
            'areas.oil.f2': 'Production process optimization',
            'areas.oil.f3': 'Derivatives quality control',
            'areas.oil.f4': 'Enhanced recovery technologies',
            'areas.gas.title': 'Natural Gas',
            'areas.gas.desc': 'Research in processing, transportation and utilization of natural gas. Liquefaction (LNG), compression (CNG) and energy utilization technologies.',
            'areas.gas.f1': 'Gas processing and treatment',
            'areas.gas.f2': 'Liquefaction technologies (LNG)',
            'areas.gas.f3': 'Pipeline monitoring',
            'areas.gas.f4': 'Conversion and energy utilization',
            'areas.bio.title': 'Biofuels',
            'areas.bio.desc': 'Renewable fuels from biological sources. Research in bioethanol, biodiesel and biogas with a focus on sustainability and energy transition.',
            'areas.bio.f1': 'Bioethanol and biodiesel production',
            'areas.bio.f2': 'Biomass conversion technologies',
            'areas.bio.f3': 'Biogas and anaerobic digestion',
            'areas.bio.f4': 'Life cycle analysis',

            'sw.title': 'Our <span class="underline-gold">Software</span>',
            'sw.subtitle': 'Cutting-edge software solutions for the oil and gas industry',
            'sw.text': 'At COPIA, we specialize in developing advanced software that uses artificial intelligence and machine learning to solve complex challenges in oil and gas exploration and production. Our solutions are designed to improve efficiency, reduce costs and increase success rates.',
            'sw.dl.subtitle': 'Integrated Engineering, Geosciences and Civil Construction Platform',
            'sw.dl.desc': 'COPIA Digital Lab integrates geospatial and engineering data in a unified three-dimensional environment, ranging from seismic survey planning and geological modeling to civil construction management, inspection, quality control and sustainability. Using artificial intelligence and machine learning, it automates acquisition geometry optimization, predicts costs and deadlines, assesses environmental risks, monitors regulatory compliance and generates quality and environmental impact reports.',
            'sw.dl.f1': 'Interactive 3D visualization and geological modeling',
            'sw.dl.f2': 'AI-powered seismic survey planning',
            'sw.dl.f3': 'Geospatial analysis and real-time dashboards',
            'sw.dl.f4': 'Cost, deadline forecasting and risk assessment',
            'sw.dl.f5': 'Construction management and civil inspection',
            'sw.dl.f6': 'Quality control and regulatory compliance',
            'sw.dl.f7': 'Environmental impact and sustainability reports',
            'sw.dl.f8': 'Integrated multi-service architecture',
            'sw.co.subtitle': 'GPS Coordinate Collector with Integrated Mapping',
            'sw.co.desc': 'COPIA Colect is an installable PWA application for collecting GPS coordinates with an interactive map. Ideal for surveying, land demarcation, field mapping and route tracking. Works offline, with multi-format export and light/dark theme.',
            'sw.co.f1': 'GPS location with meter-level accuracy',
            'sw.co.f2': 'Point collection with label, category, color and photo',
            'sw.co.f3': 'Continuous route tracking',
            'sw.co.f4': 'Distance measurement and area calculation',
            'sw.co.f5': 'Elevation profile with terrain chart',
            'sw.co.f6': 'Export in JSON, GPX and KML (Google Earth)',
            'sw.co.f7': 'Installable app (PWA) — works offline',
            'sw.co.f8': 'Multiple projects and link sharing',

            'svc.title': 'Services & <span class="underline-gold">Expertise</span>',
            'svc.subtitle': 'DPDT offers services ranging from laboratory research to specialized software development',
            'svc.s1.title': 'Research & Investigation',
            'svc.s1.desc': 'Feasibility studies, laboratory analysis, materials characterization and applied scientific research.',
            'svc.s2.title': 'Process Engineering',
            'svc.s2.desc': 'Industrial process optimization, simulation, scale-up and operational improvement implementation.',
            'svc.s3.title': 'Digital Solutions',
            'svc.s3.desc': 'Specialized software, SCADA systems, industrial IoT, monitoring platforms and automation.',
            'svc.s4.title': 'Safety & Environment',
            'svc.s4.desc': 'HSE management, environmental impact studies, risk analysis and regulatory compliance.',
            'svc.s5.title': 'Data Analysis & AI',
            'svc.s5.desc': 'Data science, predictive models, machine learning for reservoir and process optimization.',
            'svc.s6.title': 'Technical Consulting',
            'svc.s6.desc': 'Specialized advisory, technology transfer, team training and technical audits.',

            'team.title': 'Our <span class="underline-gold">Team</span>',
            'team.subtitle': 'Multidisciplinary professionals dedicated to innovation in the energy sector',
            'team.t1.name': 'DPDT Director',
            'team.t1.role': 'Head of R&D',
            'team.t2.name': 'Petroleum Eng.',
            'team.t2.role': 'Petroleum Engineer',
            'team.t3.name': 'Chemical Eng.',
            'team.t3.role': 'Chemical Engineer',
            'team.t4.name': 'Technology Lead',
            'team.t4.role': 'Technology Lead',

            'nav.blog': 'Blog',

            'blog.title': 'Scientific <span class="underline-gold">Articles</span>',
            'blog.subtitle': 'DPDT publications and studies in artificial intelligence, petrophysics and geosciences',
            'blog.a1.title': 'PINNs in Petrophysics: Integrating Deep Learning with Rock Equations',
            'blog.a1.desc': 'A critical study on Physics-Informed Neural Networks applied to porosity prediction in petroleum formations, comparing pure physics models, neural networks and hybrid approaches.',
            'blog.a1.date': 'Dec 21, 2024',
            'blog.a2.title': 'Integration of Conventional Methods and Machine Learning for Petrophysical Characterization of Fluvial Systems',
            'blog.a2.desc': 'A multi-scale comparative study between conventional and Machine Learning methods for facies characterization in fluvial depositional systems, achieving F1-Score of 0.87.',
            'blog.a2.date': 'Dec 28, 2025',
            'blog.a3.title': 'Machine Learning and Seismic Attributes for Automated 3D Structural Modeling',
            'blog.a3.desc': 'Integration of classical signal processing with Machine Learning for automated structural modeling in petroleum reservoirs, using horizon detection and RBF interpolation.',
            'blog.a3.date': 'Dec 29, 2025',
            'blog.a3.badge': 'Seismic \u00B7 3D Modeling',
            'blog.tag.petro': 'Petrophysics',
            'blog.tag.porosity': 'Porosity',
            'blog.tag.reservoir': 'Reservoirs',
            'blog.tag.fluvial': 'Fluvial Systems',
            'blog.tag.seismic': 'Seismic',
            'blog.tag.3d': '3D Modeling',
            'footer.blog': 'Blog',

            'cta.title': 'Ready to Transform Your Operations?',
            'cta.desc': 'Contact us to learn more about how our software solutions can enhance your exploration and production efficiency.',
            'cta.btn1': 'Get in Touch',
            'cta.btn2': 'Explore Software',

            'contact.title': 'Get in <span class="underline-gold">Touch</span>',
            'contact.subtitle': 'Have a project or need technical support? The DPDT team is available.',
            'contact.email': 'Email',
            'contact.phone': 'Phone',
            'contact.location': 'Location',

            'form.name': 'Full name',
            'form.email': 'Email',
            'form.company': 'Company / Institution',
            'form.select': 'Select subject',
            'form.opt1': 'Research Project',
            'form.opt2': 'Technical Consulting',
            'form.opt3': 'Software Solutions',
            'form.opt4': 'Partnership / Collaboration',
            'form.opt5': 'Career Opportunities',
            'form.opt6': 'Other Subject',
            'form.message': 'Your message...',
            'form.submit': 'Send Message',

            'news.title': 'Receive Our News',
            'news.desc': 'Subscribe to receive updates about our projects and initiatives',
            'news.placeholder': 'Your email address',
            'news.btn': 'Subscribe',

            'footer.desc': 'Research, Development and Technology Department. Innovation in petroleum, natural gas and biofuels.',
            'footer.nav': 'Navigation',
            'footer.about': 'About DPDT',
            'footer.areas': 'Areas of Operation',
            'footer.services': 'Services',
            'footer.company': 'Company',
            'footer.team': 'Team',
            'footer.contact': 'Contact',
            'footer.copy': '\u00A9 2026 DPDT - Copia Group of Companies, SA. All rights reserved.'
        }
    };

    function applyLanguage(lang) {
        var dict = translations[lang];
        if (!dict) return;

        document.documentElement.lang = lang;

        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            var key = el.getAttribute('data-i18n');
            if (dict[key] !== undefined) el.textContent = dict[key];
        });

        document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
            var key = el.getAttribute('data-i18n-html');
            if (dict[key] !== undefined) el.innerHTML = dict[key];
        });

        document.querySelectorAll('[data-i18n-ph]').forEach(function (el) {
            var key = el.getAttribute('data-i18n-ph');
            if (dict[key] !== undefined) el.placeholder = dict[key];
        });

        var label = document.getElementById('lang-label');
        if (label) label.textContent = lang.toUpperCase();

        document.title = lang === 'en'
            ? 'DPDT - Research, Development and Technology Department | Copia Group of Companies, SA'
            : 'DPDT - Departamento de Pesquisa, Desenvolvimento e Tecnologia | Copia Group of Companies, SA';
    }

    function setupLanguageToggle() {
        var btn = document.getElementById('lang-toggle');
        if (!btn) return;
        var saved = localStorage.getItem('dpdt-lang');
        var currentLang = saved || 'pt';
        if (currentLang !== 'pt') applyLanguage(currentLang);

        btn.addEventListener('click', function () {
            currentLang = currentLang === 'pt' ? 'en' : 'pt';
            localStorage.setItem('dpdt-lang', currentLang);
            applyLanguage(currentLang);
        });
    }

    /* ══════════════════════════════════════
       AI CHATBOT - DPDT Assistant
       ══════════════════════════════════════ */

    function setupChatbot() {
        // Knowledge base
        var kb = {
            empresa: 'O DPDT (Departamento de Pesquisa, Desenvolvimento e Tecnologia) é a unidade estratégica de inovação da Copia Group of Companies, SA. Sede em Luanda, Angola. Especializamo-nos em desenvolvimento de software avançado com IA e Machine Learning para resolver desafios complexos na exploração e produção de petróleo e gás.',
            missao: 'A nossa missão é desenvolver soluções inovadoras que melhorem a eficiência, reduzam custos e aumentem as taxas de sucesso na indústria de petróleo, gás e biocombustíveis.',
            estatisticas: 'Os nossos resultados: 95% de taxa de precisão, 80% de redução no tempo de processamento, e 92% de soluções integradas com IA.',
            areas: {
                geral: 'O DPDT opera em 3 áreas estratégicas: Petróleo, Gás Natural e Biocombustíveis.',
                petroleo: 'Petróleo: Pesquisa e desenvolvimento de tecnologias para exploração, produção e refinação. Inclui análise de reservatórios, controlo de qualidade de derivados, optimização de processos de extracção e tecnologias de recuperação avançada.',
                gas: 'Gás Natural: Pesquisa em processamento, transporte e utilização. Tecnologias de liquefação (LNG), compressão (CNG), monitorização de pipelines e conversão energética.',
                bio: 'Biocombustíveis: Combustíveis renováveis de fontes biológicas. Pesquisa em bioetanol, biodiesel e biogás com foco em sustentabilidade e transição energética.'
            },
            software: {
                geral: 'Temos 4 produtos de software:\n\n• <b>COPIA Seis</b> — Interpretação sísmica com IA\n• <b>COPIA DynamicSim</b> — Simulação de reservatórios com ML\n• <b>COPIA Digital Lab</b> — Plataforma digital integrada\n• <b>COPIA Colect</b> — Colector GPS com mapeamento\n\nQual deles gostaria de saber mais?',
                seis: '<b>COPIA Seis</b> — Ferramenta de interpretação sísmica com IA. Funcionalidades: picking automático de horizontes, extracção de atributos sísmicos, análise 3D, interface intuitiva, integração com plataformas sísmicas, análise em tempo real e controlo de qualidade.',
                dynamicsim: '<b>COPIA DynamicSim</b> — Simulador de reservatórios de gás e condensado com Machine Learning. Simulação de alta fidelidade, previsão de comportamento PVT, optimização de cenários de produção, visualização avançada, integração com dados de campo e análise de incertezas.',
                digitallab: '<b>COPIA Digital Lab</b> — Plataforma integrada de engenharia, geociências e construção civil. Visualização 3D interactiva, planeamento sísmico com IA, análise geoespacial, dashboards em tempo real, gestão de construção civil, controlo de qualidade e relatórios de sustentabilidade.',
                colect: '<b>COPIA Colect</b> — Aplicação PWA para colecta de coordenadas GPS com mapeamento integrado. Precisão métrica, colecta de pontos com legenda/categoria/foto, tracking contínuo de rotas, medição de distâncias e áreas, perfil de elevação, exportação em JSON/GPX/KML, funciona offline.'
            },
            servicos: 'Os nossos 6 serviços:\n\n• <b>Pesquisa & Investigação</b> — Estudos de viabilidade, análise laboratorial\n• <b>Engenharia de Processos</b> — Optimização industrial, simulação, scale-up\n• <b>Soluções Digitais</b> — Software, SCADA, IoT industrial\n• <b>Segurança & Ambiente</b> — Gestão HSE, impacto ambiental\n• <b>Análise de Dados & IA</b> — Data science, modelos preditivos, ML\n• <b>Consultoria Técnica</b> — Assessoria, transferência tecnológica, auditorias',
            contacto: 'Contacte-nos:\n\n📧 Email: <a href="mailto:dpdt@copiagroupofcompanies.com">dpdt@copiagroupofcompanies.com</a>\n📞 Telefone: +244 942 373 623\n📍 Localização: Luanda, Angola\n\nOu preencha o formulário na secção de contacto do site.',
            blog: 'Temos 3 artigos científicos publicados:\n\n• <a href="blog/pinns-petrofisica.html"><b>PINNs em Petrofísica</b></a> — Deep Learning e equações de rocha para previsão de porosidade\n• <a href="blog/integracao-de-metodos.html"><b>Integração de Métodos e ML</b></a> — Caracterização petrofísica de sistemas fluviais (F1-Score: 0.87)\n• <a href="blog/seismic-ml.html"><b>ML e Atributos Sísmicos</b></a> — Modelagem estrutural 3D automatizada',
            equipa: 'O DPDT conta com investigadores especializados. Edmilson D. Praia é um dos autores principais das nossas publicações científicas, com trabalhos em PINNs, Machine Learning para petrofísica e interpretação sísmica. Cirilo Cauxeiro é co-autor na pesquisa de PINNs em petrofísica.'
        };

        // Match user intent
        function getResponse(input) {
            var q = input.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

            // Greetings
            if (/^(ola|oi|hey|hi|hello|bom dia|boa tarde|boa noite|e ai)/.test(q))
                return 'Olá! 👋 Sou o assistente virtual do DPDT. Como posso ajudar? Pode perguntar sobre a empresa, software, serviços, áreas de actuação, blog ou contactos.';

            // Thanks
            if (/obrigad|agradec|valeu|thanks|thank you/.test(q))
                return 'De nada! Se tiver mais alguma dúvida, estou aqui para ajudar. 😊';

            // Software specific
            if (/copia\s*seis|sismic.*interpret|interpretac.*sismic/.test(q))
                return kb.software.seis;
            if (/dynamic\s*sim|simulad.*reservat|reservat.*simul/.test(q))
                return kb.software.dynamicsim;
            if (/digital\s*lab|plataforma.*integrad|geocienc/.test(q))
                return kb.software.digitallab;
            if (/colect|gps|mapeament|coordenad/.test(q))
                return kb.software.colect;
            if (/software|programa|aplicac|app|produto|solucao digital/.test(q))
                return kb.software.geral;

            // Areas
            if (/petroleo|crude|exploracao|producao|refinac|reservatorio/.test(q))
                return kb.areas.petroleo;
            if (/gas\s*natural|lng|cng|pipeline|liquefac/.test(q))
                return kb.areas.gas;
            if (/bio.*combustiv|bioetanol|biodiesel|biogas|biomassa|renovavel/.test(q))
                return kb.areas.bio;
            if (/area|sector|segmento|ramo/.test(q))
                return kb.areas.geral;

            // Services
            if (/servic|consultori|engenharia|pesquisa.*investig|seguranca.*ambient|hse|analise.*dados/.test(q))
                return kb.servicos;

            // Contact
            if (/contact|email|telefone|localizac|enderec|onde fica|como.*falar|ligar/.test(q))
                return kb.contacto;

            // Blog / articles
            if (/blog|artigo|publicac|pinns|machine learning|deep learning|petrofisic|sismic/.test(q))
                return kb.blog;

            // Company
            if (/empresa|quem|o que e|dpdt|copia group|sobre|fundad|historia|sede/.test(q))
                return kb.empresa;

            // Mission
            if (/missao|objetivo|visao|proposito/.test(q))
                return kb.missao;

            // Stats
            if (/estatistic|numero|resultado|precisao|eficienc|percent/.test(q))
                return kb.estatisticas;

            // Team
            if (/equip|team|colaborador|investigador|autor|edmilson|cirilo/.test(q))
                return kb.equipa;

            // General AI/ML
            if (/inteligencia artificial|ia\b|machine learning|ml\b|deep learning|neural|rede.*neural/.test(q))
                return 'O DPDT utiliza extensivamente IA e Machine Learning nas suas soluções. Desde interpretação sísmica automatizada (COPIA Seis) até simulação de reservatórios (DynamicSim), as nossas ferramentas incorporam algoritmos avançados. Temos também publicações científicas sobre PINNs e ML aplicado à petrofísica.';

            // Fallback
            return 'Não tenho a certeza sobre essa questão. Posso ajudar com:\n\n• Informações sobre a <b>empresa</b>\n• Os nossos <b>softwares</b> (COPIA Seis, DynamicSim, Digital Lab, Colect)\n• <b>Serviços</b> que oferecemos\n• <b>Áreas</b> de actuação\n• <b>Artigos</b> do blog\n• <b>Contactos</b>\n\nTente reformular a sua pergunta!';
        }

        // Build UI
        var fab = document.createElement('button');
        fab.className = 'chat-fab';
        fab.setAttribute('aria-label', 'Assistente IA');
        fab.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';

        var panel = document.createElement('div');
        panel.className = 'chat-panel';
        panel.innerHTML =
            '<div class="chat-header">' +
                '<div class="chat-header-info">' +
                    '<div class="chat-header-avatar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg></div>' +
                    '<div><div class="chat-header-name">DPDT Assistant</div><div class="chat-header-status">Online — IA</div></div>' +
                '</div>' +
                '<button class="chat-close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>' +
            '</div>' +
            '<div class="chat-messages" id="chat-messages"></div>' +
            '<div class="chat-input-area">' +
                '<input type="text" class="chat-input" id="chat-input" placeholder="Escreva a sua pergunta..." autocomplete="off">' +
                '<button class="chat-send" id="chat-send"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button>' +
            '</div>';

        document.body.appendChild(fab);
        document.body.appendChild(panel);

        var messages = panel.querySelector('#chat-messages');
        var inputEl = panel.querySelector('#chat-input');
        var sendBtn = panel.querySelector('#chat-send');
        var closeBtn = panel.querySelector('.chat-close');

        // Add message
        function addMsg(text, type) {
            var div = document.createElement('div');
            div.className = 'chat-msg chat-msg--' + type;
            div.innerHTML = text;
            messages.appendChild(div);
            messages.scrollTop = messages.scrollHeight;
        }

        // Add quick replies
        function addQuickReplies(options) {
            var wrap = document.createElement('div');
            wrap.className = 'chat-quick';
            options.forEach(function (opt) {
                var btn = document.createElement('button');
                btn.className = 'chat-quick-btn';
                btn.textContent = opt;
                btn.addEventListener('click', function () {
                    wrap.remove();
                    sendMessage(opt);
                });
                wrap.appendChild(btn);
            });
            messages.appendChild(wrap);
            messages.scrollTop = messages.scrollHeight;
        }

        // Show typing indicator
        function showTyping() {
            var typing = document.createElement('div');
            typing.className = 'chat-typing';
            typing.id = 'chat-typing';
            typing.innerHTML = '<span></span><span></span><span></span>';
            messages.appendChild(typing);
            messages.scrollTop = messages.scrollHeight;
        }
        function hideTyping() {
            var el = document.getElementById('chat-typing');
            if (el) el.remove();
        }

        // Send message
        function sendMessage(text) {
            if (!text.trim()) return;
            addMsg(text, 'user');
            inputEl.value = '';

            showTyping();
            var delay = 400 + Math.random() * 600;
            setTimeout(function () {
                hideTyping();
                var response = getResponse(text);
                addMsg(response, 'bot');
            }, delay);
        }

        // Events
        // Welcome bubble (outside chat panel, next to FAB)
        var bubble = document.createElement('div');
        bubble.className = 'chat-bubble';
        bubble.innerHTML = '<div class="chat-bubble-typing"><span></span><span></span><span></span></div>';
        document.body.appendChild(bubble);

        var welcomeText = 'Olá! 👋 Bem-vindo ao DPDT. Sou o seu assistente virtual. Como posso ajudar?';
        var welcomeDismissed = false;

        // Show bubble after 1.5s with typing, then reveal text
        setTimeout(function () {
            bubble.classList.add('active');
            // After 1.5s of "typing", show the actual message
            setTimeout(function () {
                bubble.innerHTML = '<span class="chat-bubble-text"></span><button class="chat-bubble-close">&times;</button>';
                var textEl = bubble.querySelector('.chat-bubble-text');
                var closeEl = bubble.querySelector('.chat-bubble-close');
                // Typewriter effect
                var i = 0;
                function typeChar() {
                    if (i < welcomeText.length) {
                        textEl.textContent += welcomeText.charAt(i);
                        i++;
                        setTimeout(typeChar, 25);
                    }
                }
                typeChar();
                // Close bubble
                closeEl.addEventListener('click', function (e) {
                    e.stopPropagation();
                    bubble.classList.remove('active');
                    welcomeDismissed = true;
                });
                // Click bubble to open chat
                bubble.addEventListener('click', function () {
                    bubble.classList.remove('active');
                    welcomeDismissed = true;
                    openChat();
                });
            }, 1500);
        }, 1500);

        function openChat() {
            panel.classList.add('active');
            fab.classList.add('hidden');
            if (bubble.classList.contains('active')) {
                bubble.classList.remove('active');
            }
            if (!messages.querySelector('.chat-msg')) {
                addMsg('Olá! 👋 Bem-vindo ao <b>DPDT</b> — Departamento de Pesquisa, Desenvolvimento e Tecnologia da Copia Group of Companies. Sou o seu assistente virtual. Como posso ajudar?', 'bot');
                addQuickReplies(['Sobre a empresa', 'Softwares', 'Serviços', 'Áreas', 'Blog', 'Contactos']);
            }
            inputEl.focus();
        }

        fab.addEventListener('click', function () {
            openChat();
        });

        closeBtn.addEventListener('click', function () {
            panel.classList.remove('active');
            fab.classList.remove('hidden');
        });

        sendBtn.addEventListener('click', function () {
            sendMessage(inputEl.value);
        });

        inputEl.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') sendMessage(inputEl.value);
        });
    }
})();
