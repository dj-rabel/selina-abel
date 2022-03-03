(function () {

   const basePath = 'C:\\Users\\abel\\PhpstormProjects\\selina-abel\\storage\\';

   // -- EDU EDITOR

   const eduelem = document.getElementById('education');
   const educontent = eduelem.innerHTML;
   eduelem.innerHTML = '';

   // @see https://github.com/codex-team/editor.js/blob/next/types/configs/editor-config.d.ts
   const editor = new EditorJS({

      holder: eduelem,

      tools: {

      },

      onReady: () => {
         editor.blocks.renderFromHTML(educontent);
      }

   });

   // editor.save().then((outputData) => {
   //    console.log('Article data: ', outputData)
   // }).catch((error) => {
   //    console.log('Saving failed: ', error)
   // });

})();
