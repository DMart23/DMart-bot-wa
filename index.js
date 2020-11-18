const qrcode = membutuhkan ("qrcode-terminal");
const saat = membutuhkan ("momen");
const cheerio = membutuhkan ("cheerio");
const fs = membutuhkan ("fs");
const dl = membutuhkan ("./ lib / downloadImage.js");
const fetch = membutuhkan ('node-fetch');
const urlencode = membutuhkan ("urlencode");
const axios = membutuhkan ("axios");
const imageToBase64 = membutuhkan ('image-to-base64');
const menu = membutuhkan ("./ menu.js");
const
{
   Koneksi WAC,
   MessageType,
   Kehadiran,
   MessageOptions,
   Mimetype,
   WALocationMessage,
   WA_MESSAGE_STUB_TYPES,
   ReconnectMode,
   ProxyAgent,
   waChatKey,
} = membutuhkan ("@ adiwajshing / baileys");
var jam = momen (). format ("HH: mm");

function foreach (arr, func)
{
   untuk (var i in arr)
   {
      func (i, arr [i]);
   }
}
const conn = new WAConnection ()
conn.on ('qr', qr =>
{
   qrcode.generate (qr,
   {
      kecil: benar
   });
   console.log (`[$ {moment (). format (" HH: mm: ss ")}] Harap Pindai QR dengan aplikasi!`);
});

conn.on ('credentials-updated', () =>
{
   // simpan kredensial setiap kali diperbarui
   console.log (`kredensial diperbarui!`)
   const authInfo = conn.base64EncodedAuthInfo () // dapatkan semua info auth yang kita perlukan untuk memulihkan sesi ini
   fs.writeFileSync ('./ session.json', JSON.stringify (authInfo, null, '\ t')) // simpan info ini ke file
})
fs.existsSync ('./ session.json') && conn.loadAuthInfo ('./ session.json')
// hapus komentar pada baris berikut untuk membuat proxy koneksi; beberapa proxy acak yang saya dapatkan: https://proxyscrape.com/free-proxy-list
//conn.connectOptions.agent = ProxyAgent ('http://1.0.180.120:8080')
conn.connect ();

conn.on ('user-presence-update', json => console.log (json.id + 'presence is' + json.type))
conn.on ('message-status-update', json =>
{
   Const participant = json.participant? '(' + json.participant + ')': '' // peserta ada saat pesan berasal dari grup
   console.log (`$ {json.to} $ {participant} menerima pesan $ {json.ids} sebagai $ {json.type}`)
})

conn.on ('message-new', async (m) =>
{
   const messageContent = m.message
   const text = m.message.conversation
   biarkan id = m.key.remoteJid
   const messageType = Object.keys (messageContent) [0] // pesan akan selalu berisi satu kunci yang menandakan jenis pesan
   biarkan imageMessage = m.message.imageMessage;
   console.log (`[$ {moment (). format (" HH: mm: ss ")}] ($ {id.split (" @ s.whatsapp.net ") [0]} => $ {text} `);


// Grup

if (text.includes ("! buatgrup"))
   {
var nama = text.split ("! buatgrup") [1] .split ("- nomor") [0];
var nom = text.split ("- nomor") [1];
var numArray = nom.split (",");
untuk (var i = 0; i <numArray.length; i ++) {
    numArray [i] = numArray [i] + "@ s.whatsapp.net";
}
var str = numArray.join ("");
console.log (str)
grup const = menunggu conn.groupCreate (nama, str)
console.log ("membuat grup dengan id:" + group.gid)
conn.sendMessage (group.gid, "hello everyone", MessageType.extendedText) // sapa semua orang di grup

}

// FF
if (text.includes ("! cek")) {
var num = text.replace (/! cek /, "")
var idn = num.replace ("0", "+ 62");

console.log (id);
const gg = idn+'@s.whatsapp.net '

const ada = menunggu conn.isOnWhatsApp (gg)
console.log (ada);
conn.sendMessage (id, `$ {gg} $ {sudah ada?" ada ":" tidak ada "} di WhatsApp`, MessageType.text)
}
jika (teks == '! menu') {
conn.sendMessage (id, menu.menu, MessageType.text);
}
lain jika (teks == '! menu1') {
conn.sendMessage (id, menu.menu1, MessageType.text);
}
lain jika (teks == '! menu2') {
conn.sendMessage (id, menu.menu2, MessageType.text);
}
lain jika (teks == '! menu3') {
conn.sendMessage (id, menu.menu3, MessageType.text);
}

   jika (messageType == 'imageMessage')
   {
      let caption = imageMessage.caption.toLocaleLowerCase ()
      const buffer = menunggu conn.downloadMediaMessage (m) // untuk mendekripsi & digunakan sebagai buffer
      if (caption == '! sticker')
      {
         const stiker = menunggu conn.downloadAndSaveMediaMessage (m) // untuk mendekripsi & menyimpan ke file

         const
         {
            eksekutif
         } = membutuhkan ("child_process");
         exec ('cwebp -q 50' + stiker + '-o temp /' + jam + '.webp', (error, stdout, stderr) =>
         {
            biarkan stik = fs.readFileSync ('temp /' + jam + '.webp')
            conn.sendMessage (id, stik, MessageType.sticker)
         });
      }
   }

   if (messageType === MessageType.text)
   {
      biarkan adalah = m.message.conversation.toLocaleLowerCase ()

      if (adalah == '! pantun')
      {

         ambil ('https://raw.githubusercontent.com/pajaar/grabbed-results/master/pajaar-2020-pantun-pakboy.txt')
            . kemudian (res => res.text ())
            . kemudian (body =>
            {
               biarkan tod = body.split ("\ n");
               biarkan pjr = tod [Math.floor (Math.random () * tod.length)];
               biarkan pantun = pjr.replace (/ pjrx-line / g, "\ n");
               conn.sendMessage (id, pantun, MessageType.text)
            });
      }

   }
   if (text.includes ("! yt"))
   {
      const url = text.replace (/! yt /, "");
      const exec = membutuhkan ('child_process'). exec;

      var videoid = url.match (/ (?: https?: \ / {2})? (?: w {3} \.)? youtu (?: be)? \. (?: com | be) (? : \ / jam tangan \? v = | \ /) ([^ \ s &] +) /);

      const ytdl = membutuhkan ("ytdl-core")
      if (videoid! = null)
      {
         console.log ("video id =", videoid [1]);
      }
      lain
      {
         conn.sendMessage (id, "gavalid", MessageType.text)
      }
      ytdl.getInfo (videoid [1]). lalu (info =>
      {
         jika (info.length_seconds> 1000)
         {
            conn.sendMessage (id, "videonya kepanjangan", MessageType.text)
         }
         lain
         {

            console.log (info.length_seconds)

            function os_func ()
            {
               this.execCommand = function (cmd)
               {
                  return new Promise ((menyelesaikan, menolak) =>
                  {
                     exec (cmd, (error, stdout, stderr) =>
                     {
                        jika (kesalahan)
                        {
                           menolak (kesalahan);
                           kembali;
                        }
                        menyelesaikan (stdout)
                     });
                  })
               }
            }
            var os = new os_func ();

            os.execCommand ('ytdl' + url + '-q tertinggi -o mp4 /' + videoid [1] + '.mp4'). lalu (res =>
            {
		const buffer = fs.readFileSync ("mp4 /" + videoid [1] + ". mp4")
               conn.sendMessage (id, buffer, MessageType.video)
            }). catch (err =>
            {
               console.log ("os >>>", err);
            })

         }
      });

   }


   if (text.includes ("! nulis"))
   {

      const
      {
         muncul
      } = membutuhkan ("child_process");
      console.log ("menulis ...")
      const teks = text.replace (/! nulis /, "")
      const split = teks.replace (/ (\ S + \ s *) {1,10} / g, "$ & \ n")
      const fixedHeight = split.split ("\ n"). slice (0, 25) .join ("\\ n")
      console.log (split)
      menelurkan ("konversi", [
            "./assets/paper.jpg",
            "-font",
            "Indie-Flower",
            "-size",
            "700x960",
            "-pointsize",
            "18",
            "-interline-spacing",
            "3",
            "-annotate",
            "+170+222",
            fixedHeight,
            "./assets/result.jpg"
         ])
         .on("error", () => console.log("error"))
         .on("exit", () =>
         {
            const buffer = fs.readFileSync("assets/result.jpg") // can send mp3, mp4, & ogg -- but for mp3 files the mimetype must be set to ogg

            conn.sendMessage(id, buffer, MessageType.image)
            console.log("done")
         })
   }


   if (text.includes("!quotes"))
   {
      var url = 'https://jagokata.com/kata-bijak/acak.html'
      axios.get(url)
         .then((result) =>
         {
            let $ = cheerio.load(result.data);
            var author = $('a[class="auteurfbnaam"]').contents().first().text();
            var kata = $('q[class="fbquote"]').contents().first().text();

            conn.sendMessage(
               id,
               `
     _${kata}_
        
    
	*~${author}*
         `, MessageType.text
            );

         });
   }

   if (text.includes("!ptl"))
   {
    var items = ["ullzang girl", "cewe cantik", "hijab cantik", "korean girl"];
    var cewe = items[Math.floor(Math.random() * items.length)];
    var url = "https://api.fdci.se/rep.php?gambar=" + cewe;
    
    axios.get(url)
      .then((result) => {
        var b = JSON.parse(JSON.stringify(result.data));
        var cewek =  b[Math.floor(Math.random() * b.length)];
        imageToBase64(cewek) // Path to the image
        .then(
            (response) => {
	var buf = Buffer.from(response, 'base64'); // Ta-da	
              conn.sendMessage(
            id,
              buf,MessageType.image)
       
            }
        )
        .catch(
            (error) => {
                console.log(error); // Logs an error if there was one
            }
        )
    
    });
    }

if (text.includes("!randomanime"))
   {
    var items = ["anime girl", "anime cantik", "anime", "anime aesthetic"];
    var cewe = items[Math.floor(Math.random() * items.length)];
    var url = "https://api.fdci.se/rep.php?gambar=" + cewe;
    
    axios.get(url)
      .then((result) => {
        var b = JSON.parse(JSON.stringify(result.data));
        var cewek =  b[Math.floor(Math.random() * b.length)];
        imageToBase64(cewek) // Path to the image
        .then(
            (response) => {
	var buf = Buffer.from(response, 'base64'); // Ta-da	
              conn.sendMessage(
            id,
              buf,MessageType.image)
       
            }
        )
        .catch(
            (error) => {
                console.log(error); // Logs an error if there was one
            }
        )
    
    });
    }

if (text.includes("!scdl")){
const fs = require("fs");
const scdl = require("./lib/scdl");

scdl.setClientID("iZIs9mchVcX5lhVRyQGGAYlNPVldzAoX");

scdl("https://m.soundcloud.com/abdul-muttaqin-701361735/lucid-dreams-gustixa-ft-vict-molina")
    .pipe(fs.createWriteStream("mp3/song.mp3"));
}



 else if (text.includes("!tts")) {
  var teks = text.split("!ttsid ")[1];
  var path = require('path');
  var text1 = teks.slice(6);
  text1 = suara;
  var suara = text.replace(/!ttsid/g, text1);
  var filepath = 'mp3/bacot.wav';
  
  
/*
 * save audio file
 */

gtts.save(filepath, suara, function() {
  console.log(`${filepath} MP3 SAVED!`)
});
await new Promise(resolve => setTimeout(resolve, 500));

	if(suara.length > 200){ // check longness of text, because otherways google translate will give me a empty file
  msg.reply("Text to long, split in text of 200 characters")
}else{

const buffer = fs.readFileSync(filepath)
	conn.sendMessage(id , buffer , MessageType.audio);

};



const { create, Client } = require('@open-wa/wa-automate')
const { color, messageLog } = require('./utils')
const msgHandler = require('./handler/message')

const start = (client = new Client()) => {
    console.log('[DEV]', color('Red Emperor', 'yellow'))
    console.log('[CLIENT] CLIENT Started!')

    // Message log for analytic
    client.onAnyMessage((fn) => messageLog(fn.fromMe, fn.type))

    // Force it to keep the current session
    client.onStateChanged((state) => {
        console.log('[Client State]', state)
        if (state === 'CONFLICT' || state === 'DISCONNECTED') client.forceRefocus()
    })

    // listening on message
    client.onMessage((message) => {
        // Cut message Cache if cache more than 3K
        client.getAmountOfLoadedMessages().then((msg) => (msg >= 3000) && client.cutMsgCache())
        // Message Handler
        msgHandler(client, message)
    })

    // listen group invitation
    client.onAddedToGroup(({ groupMetadata: { id }, contact: { name } }) =>
        client.getGroupMembersId(id)
            .then((ids) => {
                console.log('[CLIENT]', color(`Invited to Group. [ ${name} => ${ids.length}]`, 'yellow'))
                // conditions if the group members are less than 10 then the bot will leave the group
                if (ids.length <= 10) {
                    client.sendText(id, 'Sorry, the minimum group member is 10 user to use this bot. Bye~').then(() => client.leaveGroup(id))
                } else {
                    client.sendText(id, `Hello group members *${name}*, thank you for inviting this bot, to see the bot menu send *#menu*`)
                }
            }))

    // listen paricipant event on group (wellcome message)
    client.onGlobalParicipantsChanged(async (event) => {
        // const host = await client.getHostNumber() + '@c.us'
        // if (event.action === 'add' && event.who !== host) client.sendTextWithMentions(event.chat, `Hello, Welcome to the group @${event.who.replace('@c.us', '')} \n\nHave fun with us✨`)
    })

    client.onIncomingCall((callData) => {
        // client.contactBlock(callData.peerJid)
    })
}

const options = {
    sessionId: 'Imperial',
    headless: true,
    qrTimeout: 0,
    authTimeout: 0,
    restartOnCrash: start,
    cacheEnabled: false,
    useChrome: true,
    killProcessOnBrowserClose: true,
    throwErrorOnTosBlock: false,
    chromiumArgs: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--aggressive-cache-discard',
        '--disable-cache',
        '--disable-application-cache',
        '--disable-offline-load-stale-cache',
        '--disk-cache-size=0'
    ]
}

create(options)
    .then((client) => start(client))
    .catch((err) => new Error(err))

}






   // end of file


})
