const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");

const contactsPath = path.join(__dirname, "db/contacts.json");

const updateContacts = async (contacts) => {
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
};

const listContacts = async () => {
  const contacts = await JSON.parse(await fs.readFile(contactsPath));
  return contacts;
};

const getContactById = async (contactId) => {
  const contacts = await listContacts();
  const result = await contacts.find(
    ({ id }) => Number(id) === Number(contactId)
  );
  return result || null;
};

const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const index = contacts.findIndex(
    (item) => Number(item.id) === Number(contactId)
  );
  if (index === -1) {
    return null;
  }
  const [result] = await contacts.splice(index, 1);
  await updateContacts(contacts);
  return result;
};

const addContact = async (name, email, phone) => {
  const contacts = await listContacts();
  const newContact = {
    id: nanoid(),
    name,
    email,
    phone,
  };
  contacts.push(newContact);
  await updateContacts(contacts);
  return newContact;
};

module.exports = { listContacts, getContactById, removeContact, addContact };
