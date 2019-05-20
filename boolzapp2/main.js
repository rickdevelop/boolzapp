var utente = {
  fullName: 'Mia conversazione',
  conversation: [],
  picture: 'profilePic.jpeg',
};
var ajeje = {
  fullName: 'Ajeje Brazov',
  conversation: [],
  picture: 'ajeje.jpg',
};
var leonardoBonucci = {
  fullName: 'leonardo Bonucci',
  conversation: [],
  picture: 'leonardo-bonucci.jpeg',
};
var zaza = {
  fullName: 'Zaza',
  conversation: [],
  picture: 'zaza.jpg',
};
var aldoBaglio = {
  fullName: 'Aldo Baglio',
  conversation: [],
  picture: 'Aldo-Baglio.jpg',
};
var giacomoPoretti = {
  fullName: 'Giacomo Poretti',
  conversation: [],
  picture: 'Giacomo-Poretti.jpg',
};
var carte = {
  fullName: 'Circolo delle carte',
  conversation: [],
  picture: 'carte.jpg',
};
var federica = {
  fullName: 'Federica',
  conversation: [],
  picture: 'foto-foto.jpg',
};
var alessando = {
  fullName: 'Alessandro',
  conversation: [],
  picture: 'alessandro.jpg',
};
var sconosciuto = {
  fullName: '349374973',
  conversation: [],
  picture: 'sconosciuto.jpg',
};

var giorgio = {
  fullName: 'Giorgio Chiellini',
  conversation: [],
  picture: 'Giorgio_Chiellini.jpg',
};

var andrea = {
  fullName: 'Andrea Galeazzi',
  conversation: [],
  picture: 'andrea-galeazzi.jpg',
};

var ilDivino = {
  fullName: 'il divino Jonathan',
  conversation: [],
  picture: 'il divino.jpg',
};


var appUser = utente;
var activeContactsDatabase = [utente, ajeje, leonardoBonucci, alessando, zaza, aldoBaglio, giacomoPoretti, carte, federica, sconosciuto, giorgio, andrea, ilDivino];

generateRandomConversationsFor(activeContactsDatabase);


function generateRandomConversationsFor(activeContacts) {

  for (var i = 0; i < activeContacts.length; i++) {
    activeContacts[i].conversation = randomConversation();
  }

}

function randomConversation() {

  var messagesAmount = getRandomNumber(3, 7);
  var conversation = [];
  for (var i = 0; i < messagesAmount; i++) {
    conversation.push(randomMessage());
  }

  return conversation;
}

function randomMessage() {
  var newMessage = {
    message: 'Ciao come va la vita? Qui tutto bene😀🤪',


  };
  newMessage.date = '21.00';
  newMessage.isContactMessage = (getRandomNumber(0, 1) != 1) ? false : true;

  return newMessage;
}

function newObjectMessageFrom(text, isContactMessage) {
  var newMessage = {
    message: text,
  };
  newMessage.date = '21.00';
  newMessage.isContactMessage = isContactMessage;

  return newMessage;
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}



var activeContacts = activeContactsDatabase;
var selectedContact = activeContactsDatabase[0];
var queryResult = [];
var isSearching = false;


var inputField = $('#message_input');
var sendMessageBtn = $('#send_message');
var micBtn = $('#trigger_mic');
var messagesArea = $('.messages_area');
var userMessageTemplate = $('.message.user_message.template');
var contactMessageTemplate = $('.message.contact_message.template');
var inputRicerca = $('#search_bar_input');
var contactsArea = $('.contacts_list');
var contactTemplate = $('.contact.template');

manageContactsListFrom(activeContacts, contactTemplate, contactsArea);
manageChatAreaFor(activeContacts[0]);
manageTopRightBarFor(activeContacts[0]);


inputField.keypress(function () {
  if (sendMessageBtn.css('display') == 'none') {
    sendMessageBtn.show();
    micBtn.hide();
  }
});

sendMessageBtn.click(function () {
  var messaggio =  inputField.val();
  addNewMessageFrom(messaggio, userMessageTemplate, messagesArea);
  updateDatabaseFrom(messaggio, selectedContact, false);
  inputField.val('');
  sendMessageBtn.hide();
  setTimeout(function () {
    addNewMessageFrom('Ok', contactMessageTemplate, messagesArea);
    updateDatabaseFrom('Ok', selectedContact, true);
    micBtn.show();
  }, 1000);
});

function addNewMessageFrom(text, templateMessage, tagToAppend) {
  var template = templateMessage.clone();
  template.children('.message_text').text(text);
  template.removeClass('template');
  template.addClass('real');
  tagToAppend.append(template);
}

function updateDatabaseFrom(message, selectedContact, isContactMessage) {
  console.log('updating with ' + message);
  console.log(selectedContact);

  var newMessage = newObjectMessageFrom(message, isContactMessage);
  if (selectedContact.conversation && selectedContact.lenght > 1) {
  selectedContact.conversation.push(newMessage);
  }  else {
    selectedContact.conversation = [];
    selectedContact.conversation.push(newMessage);
  }
}


$('.dropdown_menu.message_actions .fa-caret-down').click(function(){
  statusActiveFor($(this).parent());
});

$('.dropdown_menu .dropdown_options').mouseleave(function () {
  statusWaitingFor($(this).parent());
  console.log($(this).find('li.delete'));
  $(this).find('li.delete').off('click');
});


$('.message.real .dropdown_menu.active .dropdown_options li.delete').click(function () {
  console.log('cancella');
  var dropdownMenu = $(this).parent().parent();
  deleteMessageInUserInterfaceAndDatabaseFrom(dropdownMenu);
});


function deleteMessageInUserInterfaceAndDatabaseFrom(dropdownMenu) {
  var currentMessage = dropdownMenu.parent();
  var allMessages = $('.message.real');

  var messageIndex = allMessages.index(currentMessage);
  console.log(messageIndex);
  currentMessage.remove();
  selectedContact.conversation.splice(messageIndex,1);
}

function statusActiveFor(dropdown) {
  if (!dropdown.hasClass('active')) {
    console.log('mostro dropdown da click');
    dropdown.toggleClass('active').toggleClass('waiting');
  }

}
function statusWaitingFor(dropdown) {
  if (!dropdown.hasClass('waiting')) {
    console.log('nascondo dropdown da mouseleave');
    dropdown.toggleClass('active').toggleClass('waiting');
  }
}


inputRicerca.on({
  keyup: function () {
    if (inputRicerca.val() == '' && event.wich == 8) {
      console.log('ricerca vuota');
      isSearching = false;
      manageContactsListFrom(activeContacts, contactTemplate, contactsArea);
      manageChatAreaFor(activeContacts[0]);
      manageTopRightBarFor(activeContacts[0]);
    } else {
      isSearching = true;
      removeAllContactsFromList();
      queryResult = getContactsFrom(activeContacts, inputRicerca.val());
      if (queryResult.length > 0) {
        console.log(queryResult);
        console.log(queryResult.length + ' risultati trovati');
        removeAllDisplayedMessages();
        manageContactsListFrom(queryResult, contactTemplate, contactsArea);
        //aggiorno i puntatori per gli eventi click
        $(document).on('click', '.contact.real', handleContactClick);

        manageChatAreaFor(queryResult[0]);
        manageTopRightBarFor(queryResult[0]);

      }
    }

  },
});

$('.contact.real').click(handleContactClick);

function manageTopRightBarFor(selectedContact) {
  var contactName = $('.conversation_nav .contact_data').find('.contact_name');
  var contactPic = $('.conversation_nav .contact_pic');
  var picSource = 'assets/' + selectedContact.picture;
  contactName.text(selectedContact.fullName);
  contactPic.attr('src', picSource);

}

function handleContactClick() {
  selectedContact = $('.contact.real.selected');
  var selectedContactIndex = $('.contact.real').index(selectedContact);
  console.log('cliccato contatto');
  var clickedContact = $(this);
  $('.contact.real').removeClass('selected');
  clickedContact.addClass('selected');
  var contactIndex = $('.contact.real').index(clickedContact);

  if (selectedContactIndex != contactIndex) {
    console.log('indice toccato differente');
    removeAllDisplayedMessages();

    selectedContact = (!isSearching) ? activeContacts[contactIndex] : queryResult[contactIndex];

    manageChatAreaFor(selectedContact);
    manageTopRightBarFor(selectedContact);
  } else {
    console.log('toccato stesso contatto');
  }

}

function getContactsFrom(database, searchParameter) {

  var result = [];
  if (searchParameter != null) {

    var lowercasedSearch = searchParameter.toLowerCase();
    var lowerCasedName;
    for (var i = 0; i < database.length; i++) {
      lowerCasedName = database[i].fullName.toLowerCase();
      if (lowerCasedName.includes(lowercasedSearch)) {
        result.push(database[i]);
      }
    }

    return result;
  }

  return database;
}

function manageContactsListFrom(contactGroup, contactTemplate, tagToAppend) {
  for (var i = 0; i < contactGroup.length; i++) {
    var contact = contactTemplate.clone();
    var contactName = contact.find('.contact_name');
    var latestMessage = contact.find('.last_message');
    var latestMessageDate = contact.find('.last_received_time');
    var contactPicture = contact.find('.contact_pic');
    contactName.text(contactGroup[i].fullName);
    if (contactGroup[i].conversation.length > 0) {
    latestMessage.text(contactGroup[i].conversation[0].message);
    latestMessageDate.text(contactGroup[i].conversation[0].date);
  } else {
    latestMessage.text('Nessun Messaggio da visualizzare');
    latestMessageDate.text('');
  }

    var picSource = 'assets/' + contactGroup[i].picture;
    contactPicture.attr('src', picSource);
    //manage classes
    contact.removeClass('template').addClass('real').removeClass('selected');
    if (i == 0) {
      contact.addClass('selected');
    }

    tagToAppend.append(contact);
  }

}

function removeAllContactsFromList() {
  $('.contact.real').each(function () {
    $(this).remove();
  });
}

function removeAllDisplayedMessages() {
  $('.message.real').each(function () {
    $(this).remove();

  });
}

function manageChatAreaFor(selectedContact) {
  messagesArea = $('.messages_area');
  console.log(selectedContact.fullName);
  var conversationMessages = selectedContact.conversation;

  for (var i = 0; i < conversationMessages.length; i++) {

    var template = (conversationMessages[i].isContactMessage) ? contactMessageTemplate.clone() : userMessageTemplate.clone();
    template.children('.message_text').text(conversationMessages[i].message);
    template.find('.message_time').text(conversationMessages[i].date)
    template.addClass('real');
    template.removeClass('template');
    messagesArea.append(template);

  }

  $('.dropdown_menu .dropdown_options li.delete').off('click');

  $('.dropdown_menu .dropdown_options li.delete').click(function () {
    console.log('cancella');
    var dropdownMenu = $(this).parent().parent();
    deleteMessageInUserInterfaceAndDatabaseFrom(dropdownMenu);
  });


  $(document).on('click', '.dropdown_menu.message_actions .fa-caret-down', function () {
    statusActiveFor($(this).parent());
  });

  $(document).on('mouseleave', '.dropdown_menu .dropdown_options', function () {
    statusWaitingFor($(this).parent());
  });

}
