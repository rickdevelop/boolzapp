// Milestone 1
// Replica della grafica con la possibilità di avere messaggi
// scritti dall’utente (verdi) e dall’interlocutore (bianco) assegnando due classi CSS diverse
// Aggiunta di un messaggio: l’utente scrive un testo nella parte bassa e cliccando
// invia il testo viene aggiunto al thread sopra, come messaggio verde

// Milestone 2
// - Risposta dall’interlocutore: ad ogni inserimento di un messaggio,
// l’utente riceverà un “ok” come risposta, che apparirà dopo 1 secondo.
// - Ricerca utenti: scrivendo qualcosa nell’input a sinistra,
// vengono visualizzati solo i contatti il cui nome contiene le lettere inserite
// (es, Marco, Matteo Martina -> Scrivo “mar” rimangono solo Marco e Martina)

function messaggioDainserire() {

    var inputVar = $('.write-input').val().toLowerCase();
    if ( inputVar ) {

        var newMessage = $('.main-message').children().first().clone();
        newMessage.children().first().text(inputVar);
        $('.main-message').append(newMessage);

        var setRisp = setTimeout(function() {

            var rispMessage = newMessage.clone();
            rispMessage.removeClass('message--sent').addClass('message--received');
            rispMessage.children().first().text('Ok!');
            $('.main-message').append(rispMessage);
          }, 1500);
    }
    $('.write-input').val('');
}


$(document).ready(function() {

    $('.write__dx').click(function() {
        messaggioDainserire();
    });

    $('.write-input').keypress(function( e ) {
        if ( event.which === 13 ) {
            messaggioDainserire();
        }
    });

    $('.sidebar__input').keyup(function( e ) {
        mostraUtentiAlMatch();
    });

});

function mostraUtentiAlMatch() {

    $('.contatti').hide();

    var searchWord = $('.sidebar__input').val().toLowerCase();

    $('.contatti__name').each(function() {

        if ( $(this).text().toLowerCase().includes(searchWord) ) {
            $(this).closest('.contatti').show();
        }
    });
}
