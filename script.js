const data = [
  {
    id: 'mat01',
    title: 'Heurísticas de Nielsen',
    lessons: [
      {id:'m1a1', title:'Aula 1 - Introdução', steps:[
        {type:'video', value:'c1DCt5zLVyM'},
        {type:'text', value:'Este é o texto da continuação da aula. Aqui você explica conceitos importantes.'},
        {type:'image', value:'https://via.placeholder.com/800x450?text=Imagem+da+Aula+1'},
        {type:'audio', value:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'}
      ]},
      
    ]
  },
  
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
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const progress = document.getElementById('progress');

let currentContent = null;
let currentLesson = null;
let currentStepIndex = 0;

function renderContents(){
  contentList.innerHTML='';
  data.forEach(c=>{
    const div = document.createElement('div');
    div.className='content-item';
    div.textContent = c.title;
    div.onclick = ()=>{selectContent(c.id)};
    div.id = 'cont-'+c.id;
    contentList.appendChild(div);
  })
}

function selectContent(id){
  currentContent = data.find(x=>x.id===id);
  document.querySelectorAll('.content-item').forEach(el=>el.classList.remove('active'));
  const el = document.getElementById('cont-'+id); if(el) el.classList.add('active');
  renderLessons();
  resetStage();
}

function renderLessons(){
  lessonList.innerHTML='';
  if(!currentContent) return;
  currentContent.lessons.forEach(l=>{
    const d = document.createElement('div');
    d.className='lesson';
    d.textContent = l.title;
    d.onclick = ()=>{selectLesson(l.id)};
    d.id = 'les-'+l.id;
    lessonList.appendChild(d);
  })
}

function selectLesson(id){
  if(!currentContent) return;
  currentLesson = currentContent.lessons.find(x=>x.id===id);
  document.querySelectorAll('.lesson').forEach(el=>el.classList.remove('active'));
  const el = document.getElementById('les-'+id); if(el) el.classList.add('active');
  currentStepIndex = 0;
  showStep();
}

function resetStage(){
  currentLesson = null; currentStepIndex = 0; placeholder.style.display='block';
  videoWrap.classList.add('hidden'); textWrap.classList.add('hidden'); imageWrap.classList.add('hidden'); audioWrap.classList.add('hidden');
  ytPlayer.src = '';
  currentMeta.textContent = 'Selecione uma aula para visualizar o material';
  progress.textContent = '—';
}

function showStep(){
  if(!currentLesson){resetStage(); return}
  const step = currentLesson.steps[currentStepIndex];
  placeholder.style.display='none';
  videoWrap.classList.add('hidden'); textWrap.classList.add('hidden'); imageWrap.classList.add('hidden'); audioWrap.classList.add('hidden');

  if(step.type==='video'){
    ytPlayer.src = 'https://www.youtube.com/embed/'+step.value+'?rel=0&showinfo=0';
    videoWrap.classList.remove('hidden');
    currentMeta.textContent = currentLesson.title + ' — Vídeo';
  } else if(step.type==='text'){
    textContent.textContent = step.value;
    textWrap.classList.remove('hidden');
    currentMeta.textContent = currentLesson.title + ' — Texto';
  } else if(step.type==='image'){
    imageContent.src = step.value;
    imageWrap.classList.remove('hidden');
    currentMeta.textContent = currentLesson.title + ' — Imagem';
  } else if(step.type==='audio'){
    audioContent.src = step.value;
    audioWrap.classList.remove('hidden');
    currentMeta.textContent = currentLesson.title + ' — Áudio';
  }
  progress.textContent = `Passo ${currentStepIndex+1} de ${currentLesson.steps.length}`;
}

nextBtn.onclick = ()=>{
  if(!currentLesson) return;
  if(currentStepIndex < currentLesson.steps.length-1){
    currentStepIndex++;
    showStep();
  } else {
    alert('Você chegou ao fim desta aula.');
  }
}

prevBtn.onclick = ()=>{
  if(!currentLesson) return;
  if(currentStepIndex>0){
    currentStepIndex--;
    showStep();
  }
}

renderContents();