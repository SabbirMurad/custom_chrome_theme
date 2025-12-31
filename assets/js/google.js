{/* <a class="item" href="" target="_blank">
    <img src=""
        alt="Google">
    <span></span>
</a>
<a class="item" href="" target="_blank">
    <img src=""
        alt="Google">
    <span></span>
</a>
<a class="item" href="" target="_blank">
    <img src="" alt="Google">
    <span></span>
</a>
<a class="item" href="" target="_blank">
    <img src="" alt="Google">
    <span></span>
</a>
<a class="item" href="" target="_blank">
    <img src="" alt="Google">
    <span></span>
</a>
<a class="item" href="" target="_blank">
    <img src=""
        alt="Google">
    <span></span>
</a>
<a class="item" href="" target="_blank">
    <img src="" alt="Google">
    <span></span>
</a> */}

const googleItems = [
    {
        'image': 'https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_spreadsheet_x32.png',
        'name': 'Sheets',
        'url': 'https://docs.google.com/spreadsheets/u/0/'
    },
    {
        'image': 'https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_document_x32.png',
        'name': 'Documents',
        'url': 'https://docs.google.com/document/u/0/'
    },
    {
        'image': 'https://www.gstatic.com/images/branding/product/1x/forms_2020q4_48dp.png',
        'name': 'Forms',
        'url': 'https://docs.google.com/forms/u/0/'
    },
    {
        'image': 'https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_drive_x32.png',
        'name': 'Drive',
        'url': 'https://drive.google.com/u/0/'
    },
    {
        'image': 'https://www.gstatic.com/play-apps-publisher/play_console_favicon.png',
        'name': 'Play Console',
        'url': 'https://play.google.com/console/u/0/'
    },
    {
        'image': 'https://www.gstatic.com/devrel-devsite/prod/v210625d4186b230b6e4f2892d2ebde056c890c9488f9b443a741ca79ae70171d/firebase/images/favicon.png',
        'name': 'Firebase',
        'url': 'https://console.firebase.google.com/u/0/'
    },
    {
        'image': 'https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_email_x32.png',
        'name': 'Gmail',
        'url': 'https://mail.google.com/mail/u/0/#inbox'
    },
];

const googleItemsWrapper = document.querySelector('#google-wrapper .item-container')

for (let item of googleItems) {
    let tag = document.createElement('a');
    tag.setAttribute('target', '_blank');
    tag.setAttribute('href', item.url);
    tag.classList.add('item');

    tag.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <span>${item.name}</span>
    `;

    googleItemsWrapper.appendChild(tag);
}