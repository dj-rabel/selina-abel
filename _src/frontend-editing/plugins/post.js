// <post>
//     <header>
//         <div class="title">
//             <h3>Magna sed adipiscing</h3>
//             <p>Lorem ipsum dolor amet nullam consequat etiam feugiat</p>
//         </div>
//         <div class="meta">
//             <div>
//                 <span>Status</span><br/>
//                 <span>Est.</span>
//             </div>
//             <div>
//                 <b>Work in progress</b><br/>
//                 <time class="published" datetime="2022">Late 2022</time>
//             </div>
//         </div>
//     </header>
// 
//     <p>Mauris neque quam, fermentum ut nisl vitae, convallis maximus nisl. Sed mattis nunc id lorem euismod
//         placerat. Vivamus porttitor magna enim, ac accumsan tortor cursus at. Phasellus sed ultricies mi non
//         congue ullam corper. Praesent tincidunt sed tellus ut rutrum. Sed vitae justo condimentum, porta
//         lectus vitae, ultricies congue gravida diam non fringilla.</p>
//     <footer>
//         <ul class="actions">
//             <li><a href="single.html" class="button large">Continue Reading</a></li>
//         </ul>
//         <ul class="authors">
//             <li>Authors</li>
//             <li><a href="#" class="author">Minnie Musterfrau</a></li>
//             <li><a href="#" class="author"><b>Selina Abel</b></a></li>
//             <li><a href="#" class="author">Max Mustermann</a></li>
//         </ul>
//     </footer>
// </post>

import PostEditing from './post/editing';
import PostUI from './post/ui';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class Post extends Plugin {
    static get requires() {
        return [ PostEditing, PostUI ];
    }
}
