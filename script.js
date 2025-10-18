const data = [
  {
    id: 'mat01',
    title: 'Heurísticas de Nielsen',
    lessons: [
      {
        id: 'm1a1',
        title: 'Aula 1 - Introdução',
        steps: [
          { type: 'video', value: 'c1DCt5zLVyM' },
          { type: 'text', value: 'Este é o texto da continuação da aula. Aqui você explica conceitos importantes.' },
          { type: 'image', value: 'https://via.placeholder.com/800x450?text=Imagem+da+Aula+1' },
          { type: 'audio', value: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' }
        ]
      },
      {
        id: 'm1a2',
        title: 'Aula 2 - Heurísticas Animadas',
        steps: [
          { type: 'heuristic', value: { title: '1. Visibilidade do status do sistema', description: 'O sistema deve sempre manter os usuários informados sobre o que está acontecendo, através de feedback apropriado e em tempo hábil.' } },
          { type: 'heuristic', value: { title: '2. Correspondência entre o sistema e o mundo real', description: 'O sistema deve falar a língua do usuário, com palavras, frases e conceitos familiares.' } },
          { type: 'heuristic', value: { title: '3. Controle e liberdade do usuário', description: 'Os usuários muitas vezes escolhem funções do sistema por engano e precisam de uma “saída de emergência” claramente marcada.' } },
          { type: 'heuristic', value: { title: '4. Consistência e padronização', description: 'O usuário não deve ter que se perguntar se palavras, situações ou ações diferentes significam a mesma coisa. O sistema deve seguir padrões de design internos e externos' } },
          { type: 'heuristic', value: { title: '5. Prevenção de Erros', description: 'É melhor prevenir que um erro ocorra do que apresentar uma boa mensagem de erro. Elimine condições propensas a erros ou forneça opções de confirmação antes de uma ação irreversível.' } },
          { type: 'heuristic', value: { title: '6. Reconhecimento em vez de Recordação', description: 'Minimize a carga de memória do usuário tornando objetos, ações e opções visíveis. O usuário não deve ter que lembrar de informações de uma parte para outra da interface.' } },
          { type: 'heuristic', value: { title: '7. Flexibilidade e Eficiência de Uso', description: 'Ofereça aceleradores (atalhos de teclado, comandos customizáveis) para usuários experientes, permitindo que o sistema atenda tanto a novatos quanto a especialistas.' } },
          { type: 'heuristic', value: { title: '8. Estética e Design Minimalista', description: 'As interfaces não devem conter informações irrelevantes ou raramente necessárias. Todo conteúdo extra compete com as informações realmente importantes e diminui a visabilidade.' } },
          { type: 'heuristic', value: { title: '9. Ajude os Usuários a Reconhecerem, Diagnosticarem e Recuperarem-se de Erros', description: 'As mensagens de erro devem ser expressas em linguagem simples (sem códigos), indicar o problema com precisão e sugerir construtivamente uma solução.' } },
          { type: 'heuristic', value: { title: '10. Ajuda e Documentação', description: 'Embora seja melhor que o sistema possa ser usado sem documentação, pode ser necessário fornecer ajuda e documentação. Esta deve ser fácil de pesquisar, focada na tarefa e concisa' } }
          
        ]
      }
    ]
  }
];

const contentList = document.getElementById('contentList');
const lessonList = document.getElementById('lessonList');
const currentMeta = document.getElementById('currentMeta');
const placeholder = document.getElementById('placeholder');
const videoWrap = document.getElementById('videoWrap');
const ytPlayer = document.getElementById('ytPlayer');
const textWrap = document.getElementById('textWrap');
const textContent = document.getElementById('textContent');
const imageWrap = document.getElementById('imageWrap');
const imageContent = document.getElementById('imageContent');
const audioWrap = document.getElementById('audioWrap');
const audioContent = document.getElementById('audioContent');
const heuristicWrap = document.getElementById('heuristicWrap');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const progress = document.getElementById('progress');
const loadingSpinner = document.getElementById('loadingSpinner');

let currentContent = null;
let currentLesson = null;
let currentStepIndex = 0;

function renderContents() {
  contentList.innerHTML = '';
  data.forEach(c => {
    const div = document.createElement('div');
    div.className = 'content-item';
    div.textContent = c.title;
    div.onclick = () => selectContent(c.id);
    div.id = 'cont-' + c.id;
    contentList.appendChild(div);
  });
}

function selectContent(id) {
  currentContent = data.find(x => x.id === id);
  document.querySelectorAll('.content-item').forEach(el => el.classList.remove('active'));
  document.getElementById('cont-' + id)?.classList.add('active');
  renderLessons();
  resetStage();
}

function renderLessons() {
  lessonList.innerHTML = '';
  currentContent?.lessons.forEach(l => {
    const d = document.createElement('div');
    d.className = 'lesson';
    d.textContent = l.title;
    d.onclick = () => selectLesson(l.id);
    d.id = 'les-' + l.id;
    lessonList.appendChild(d);
  });
}

function resetStage() {
  currentLesson = null;
  currentStepIndex = 0;
  placeholder.style.display = 'block';
  [videoWrap, textWrap, imageWrap, audioWrap, heuristicWrap].forEach(el => el.classList.add('hidden'));
  ytPlayer.src = '';
  currentMeta.textContent = 'Selecione uma aula para visualizar o material';
  progress.textContent = '—';
  hideSpinner();
}

function showStep() {
  if (!currentLesson) {
    resetStage();
    return;
  }

  showSpinner();

  const step = currentLesson.steps[currentStepIndex];

  // Limpa todos os elementos antes de exibir o novo
  [videoWrap, textWrap, imageWrap, audioWrap, heuristicWrap].forEach(el => {
    el.classList.add('hidden');
    el.classList.remove('show');
  });
  placeholder.style.display = 'none';

  setTimeout(() => {
    try {
      switch (step.type) {
        case 'video':
          ytPlayer.src = 'https://www.youtube.com/embed/' + step.value + '?rel=0';
          showElement(videoWrap);
          currentMeta.textContent = `${currentLesson.title} — Vídeo`;
          break;
        case 'text':
          textContent.textContent = step.value;
          showElement(textWrap);
          currentMeta.textContent = `${currentLesson.title} — Texto`;
          break;
        case 'image':
          imageContent.src = step.value;
          showElement(imageWrap);
          currentMeta.textContent = `${currentLesson.title} — Imagem`;
          break;
        case 'audio':
          audioContent.src = step.value;
          showElement(audioWrap);
          currentMeta.textContent = `${currentLesson.title} — Áudio`;
          break;
        case 'heuristic':
          heuristicWrap.innerHTML = '';
          const card = document.createElement('div');
          card.className = 'heuristic-card';
          card.innerHTML = `<h4>${step.value.title}</h4><p>${step.value.description}</p>`;
          heuristicWrap.appendChild(card);
          showElement(heuristicWrap);
          currentMeta.textContent = `${currentLesson.title} — Heurística`;
          break;
      }
      progress.textContent = `Passo ${currentStepIndex + 1} de ${currentLesson.steps.length}`;
    } finally {
      hideSpinner();
    }
  }, 500);
}

function showElement(el) {
  el.classList.remove('hidden');
  requestAnimationFrame(() => el.classList.add('show'));
}

function showSpinner() {
  loadingSpinner.classList.remove('hidden');
}

function hideSpinner() {
  loadingSpinner.classList.add('hidden');
}

function selectLesson(id) {
  if (!currentContent) return;
  currentLesson = currentContent.lessons.find(x => x.id === id);
  document.querySelectorAll('.lesson').forEach(el => el.classList.remove('active'));
  document.getElementById('les-' + id)?.classList.add('active');
  currentStepIndex = 0;
  showStep();
}

nextBtn.onclick = () => {
  if (!currentLesson) return;
  if (currentStepIndex < currentLesson.steps.length - 1) {
    currentStepIndex++;
    showStep();
  } else {
    alert('Você chegou ao fim desta aula.');
  }
};

prevBtn.onclick = () => {
  if (!currentLesson) return;
  if (currentStepIndex > 0) {
    currentStepIndex--;
    showStep();
  }
};

renderContents();
