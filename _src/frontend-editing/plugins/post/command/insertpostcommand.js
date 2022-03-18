import Command from '@ckeditor/ckeditor5-core/src/command';

export default class InsertPostCommand extends Command {
    /**
     * @inheritDoc
     */
    execute(options) {
        /** @type {Model} */
        const model = this.editor.model;
        let position = options.position;

        throw 'FIX THIS!';

        model.change(writer => {
            const newPost = writer.createContainerElement('post', {}, [

                writer.create
            ]);


            const paragraph = writer.createElement('paragraph');

            if (!model.schema.checkChild(position.parent, paragraph)) {
                const allowedParent = model.schema.findAllowedParent(position, paragraph);

                // It could be there's no ancestor limit that would allow paragraph.
                // In theory, "paragraph" could be disallowed even in the "$root".
                if (!allowedParent) {
                    return;
                }

                position = writer.split(position, allowedParent).position;
            }

            model.insertContent(paragraph, position);

            writer.setSelection(paragraph, 'in');
        });
    }
}
