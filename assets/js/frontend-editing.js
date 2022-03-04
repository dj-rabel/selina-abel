(function () {

   const basePath = 'C:\\Users\\abel\\PhpstormProjects\\selina-abel\\storage\\';

    class SimpleBoxEditing extends Plugin {
        init() {
            console.log( 'SimpleBoxEditing#init() got called' );

            this._defineSchema();
            this._defineConverters();                                              // ADDED
        }

        _defineSchema() {
            // ...
        }

        _defineConverters() {                                                      // ADDED
            const conversion = this.editor.conversion;

            conversion.elementToElement( {
                model: 'simpleBox',
                view: {
                    name: 'section',
                    classes: 'simple-box'
                }
            } );

            conversion.elementToElement( {
                model: 'simpleBoxTitle',
                view: {
                    name: 'h1',
                    classes: 'simple-box-title'
                }
            } );

            conversion.elementToElement( {
                model: 'simpleBoxDescription',
                view: {
                    name: 'div',
                    classes: 'simple-box-description'
                }
            } );
        }
    }


   // -- EDU EDITOR

   const eduelem = document.getElementById('education').querySelector('.contenteditable');

   BalloonEditor
       .create( eduelem)
       .catch( error => {
          console.error( error );
       } );


   // const educontent = eduelem.innerHTML;
   // eduelem.innerHTML = '';
   //
   // // @see https://github.com/codex-team/editor.js/blob/next/types/configs/editor-config.d.ts
   // const editor = new EditorJS({
   //
   //    holder: eduelem,
   //
   //    tools: {
   //
   //    },
   //
   //    onReady: () => {
   //       editor.blocks.renderFromHTML(educontent);
   //    }
   //
   // });

   // editor.save().then((outputData) => {
   //    console.log('Article data: ', outputData)
   // }).catch((error) => {
   //    console.log('Saving failed: ', error)
   // });

})();
