const fs = require('fs');
const path = require('path');
const {nanoid} = require('nanoid');

// membuat folder data jika belum ada
const dirPath = path.join(__dirname, 'data');
if(!fs.existsSync(dirPath)){
    fs.mkdirSync(dirPath);
};

// membuat file contacts.json jika belum ada
const dataPath = path.join(dirPath, 'contacts.json');
if(!fs.existsSync(dataPath)){
    fs.writeFileSync(dataPath, '[]', 'utf-8');
}

// mengambil data dari file contacts.json
const loadContact = () =>{
    const fileBuffer = fs.readFileSync(dataPath, 'utf-8');
    const contacts = JSON.parse(fileBuffer);
    return contacts;
}

const findContact = (id) => {
    const contacts = loadContact();
    const contact = contacts.find(contact => contact.id === id);
    return contact;
}
const addContact = (data) => {
    const contacts = loadContact();
    const newContact = {
        id: nanoid(16),
        nama: data.nama,
        nohp: data.nohp,
        email: data.email
    }
    contacts.push(newContact);
    const newContacts = JSON.stringify(contacts);
    fs.writeFileSync(dataPath, newContacts, 'utf-8');
}
const deleteContact = (id) =>{
    const contact = loadContact();
    const index = contact.findIndex(contact => contact.id === id);
    if(index !== -1){
        contact.splice(index, 1);
        const newContacts = JSON.stringify(contact);
        fs.writeFileSync(dataPath, newContacts, 'utf-8');
    }else{
        console.log('data tidak ditemukan');
    }

}
const updateContact = (id, data) =>{
    const contacts = loadContact();
    const index = contacts.findIndex(contact => contact.id === id);
    if(index !== -1){
        contacts[index] = {...contacts[index], ...data};
        const newContacts = JSON.stringify(contacts);
        fs.writeFileSync(dataPath, newContacts, 'utf-8');
    }else{
        console.log('data tidak ditemukan');
    }
};
module.exports = {loadContact, findContact, addContact, deleteContact, updateContact};