
//var pathToFfmpeg = require('ffmpeg-static'); 

//const { prefix } = require('.vscode\Config.json');
let handleMemberJoined = async (MemberId) => {
   
    console.log('A new member has joined the room:', MemberId)
    addMemberToDom(MemberId)
    
    let members = await channel.getMembers()
    updateMemberTotal(members)
    let {name} = await rtmClient.getUserAttributesByKeys(MemberId, ['name'])
    addBotMessageToDom(`Welcome to the room ${name}! 👋`)

     
}

let addMemberToDom = async (MemberId) => {
    let {name} = await rtmClient.getUserAttributesByKeys(MemberId, ['name'])
    let x=document.getElementById('donate__m');
    let membersWrapper = document.getElementById('member__list')
    let memberItem = `<div class="member__wrapper" id="member__${MemberId}__wrapper">
                        <span class="green__icon"></span>
                        <p class="member_name">${name}</p>
                    </div>`
        let opt= document.createElement("option");
        opt.innerHTML=name;
        opt.id=name;
        x.appendChild(opt);  
                
    membersWrapper.insertAdjacentHTML('beforeend', memberItem)
    
}

let updateMemberTotal = async (members) => {
    let total = document.getElementById('members__count')
    total.innerText = members.length
}

let updatemoneyTotal = async (own) => {
    let total = document.getElementById('members__count')
    total.innerText = members.length
}
 
let handleMemberLeft = async (MemberId) => {
    removeMemberFromDom(MemberId)

    let members = await channel.getMembers()
    updateMemberTotal(members)
}

let removeMemberFromDom = async (MemberId) => {
    let memberWrapper = document.getElementById(`member__${MemberId}__wrapper`)
    let x=document.getElementById('donate__m');
    let name = memberWrapper.getElementsByClassName('member_name')[0].textContent
    //let name1 = memberWrapper.getElementsByClassName('member_name')[1].textContent
   
    addBotMessageToDom(`${name} has left the room.`)
    document.getElementById(name).remove()
    console.log("remove:",name);
    memberWrapper.remove()
    
}

let getMembers = async () => {
    let members = await channel.getMembers()
    updateMemberTotal(members)
    for (let i = 0; members.length > i; i++){
        addMemberToDom(members[i])
    }
}

let handleChannelMessage = async (messageData, MemberId) => {


    let data = JSON.parse(messageData.text)
    let music_box = `<audio id = "music1" style="display : none;" autoplay="autoplay" preload= "auto" controls="controls" loop="loop" 
                    src="aespa Savage MV.mp3"></audio>`
    console.log('A new message was received',data) 
   
    if(data.message.startsWith("!!")){
    if (data.message === '!!help'){
        addBotMessageToDom(`function : !!play 播放音樂 || !!pause停止音樂 `)
    }else if(data.message === '!!play'){
        addBotMessageToDom(`正在播放音樂`)
        document.getElementById('music-container').insertAdjacentHTML('afterend',music_box)
    }else if(data.message ==='!!pause'){
        document.getElementById('music1').remove()
        addBotMessageToDom(`音樂已關`)
    }else{
        addBotMessageToDom(`there is no function for you!!`)
        }
    }else if(data.message === ('')){
        addMessageToDom(data.displayName, data.message)
        let donate_video = `<video autoplay id="video1">
        <source src="直播影片.mp4" type="video/mp4" />
      </video>
      `
        document.getElementById('stream__container').insertAdjacentHTML('afterend',donate_video)
        setTimeout(function() {
            document.getElementById('video1').remove()
          }, 2000);
     
    }
 else{
    if(data.type === 'chat'){
        addMessageToDom(data.displayName, data.message)
    }
}
    if(data.type === 'user_left'){
        document.getElementById(`user-container-${data.uid}`).remove()

        if(userIdInDisplayFrame === `user-container-${uid}`){
            displayFrame.style.display = null
    
            for(let i = 0; videoFrames.length > i; i++){
                videoFrames[i].style.height = '300px'
                videoFrames[i].style.width = '300px'
            }
        }
    }
}

let sendMessage = async (e) => {
    e.preventDefault()

    let message = e.target.message.value
    channel.sendMessage({text:JSON.stringify({'type':'chat', 'message':message, 'displayName':displayName})})
    addMessageToDom(displayName, message)
    e.target.reset()
}

let addMessageToDom = (name, message) => {
    let messagesWrapper = document.getElementById('messages')

    let newMessage = `<div class="message__wrapper">
                        <div class="message__body">
                            <strong class="message__author">${name}</strong>
                            <p class="message__text">${message}</p>
                        </div>
                    </div>`
    
    let music_box = `<audio id = "music1" style="display : none;" autoplay="autoplay" preload= "auto" controls="controls" loop="loop" 
                    src="aespa Savage MV.mp3"></audio>`
   
    if(message.startsWith("!!")){
    if (message ==='!!help'){
        addBotMessageToDom(`function : !!play 播放音樂 ||  !!pause停止音樂`)
    }else if(message === '!!play'){
        addBotMessageToDom(`正在播放音樂`)
        document.getElementById('music-container').insertAdjacentHTML('afterend',music_box)
    }else if(message === '!!pause'){
        document.getElementById('music1').remove()
        addBotMessageToDom(`音樂已關`)
    }else{
        addBotMessageToDom(`there is no function for you!!`)
        }}
    else if(message ===''){
            let a = document.getElementById('donate__m').value
             let newMessage1 = `<div class="message__wrapper">
                         <div class="message__body">
                             <strong class="message__author">${name}</strong>
                             <p class="message__text">------ I give ${a} a flower ----</p>
                         </div>
                     </div>`
                     let donate_video = `<video autoplay id="video1">
                     <source src="直播影片.mp4" type="video/mp4" />
                   </video>
                   `         
         messagesWrapper.insertAdjacentHTML('beforeend', newMessage1)
        document.getElementById('stream__container').insertAdjacentHTML('beforeend',donate_video)
        setTimeout(function() {
            document.getElementById('video1').remove()
          }, 2000);
     
         }
    else{
    messagesWrapper.insertAdjacentHTML('beforeend', newMessage)
    }
    let lastMessage = document.querySelector('#messages .message__wrapper:last-child')
    if(lastMessage){
        lastMessage.scrollIntoView()
    }
}


let addBotMessageToDom = (botMessage) => {
    let messagesWrapper = document.getElementById('messages')

    let newMessage = `<div class="message__wrapper">
                        <div class="message__body__bot">
                            <strong class="message__author__bot">🐢Jenie Jenie </strong>
                            <p class="message__text__bot">${botMessage}</p>
                        </div>
                    </div>`

    messagesWrapper.insertAdjacentHTML('beforeend', newMessage)

    let lastMessage = document.querySelector('#messages .message__wrapper:last-child')
    if(lastMessage){
        lastMessage.scrollIntoView()
    }
}

let leaveChannel = async () => {
    await channel.leave()
    await rtmClient.logout()
}
let donate_con= false;
let donatefun = async (e) => {
    let donate_box = `<button id="d0-btn"  value= 100>
    <img src="https://png.pngtree.com/png-clipart/20210928/ourlarge/pngtree-flower-ink-abstract-ink-style-png-image_3954794.png" width="24" height="24" viewBox="0 0 24 24" srcset="https://cdn.iconscout.com/icon/free/png-512/money-sack-1543253-1305726.png 2x" alt="Money sack Icon" width="256">
</button>

    `
    let donateButton = e.currentTarget
    if(!donate_con){
        donate_con= true;
        donateButton.classList.add('active')
    document.getElementById('donate__container').insertAdjacentHTML('afterend', donate_box)
    }else{
        donate_con= false;
        document.getElementById('donate-btn').classList.remove('active')
        document.getElementById(`d0-btn`).remove()
       
    }
   
   
}


document.getElementById('donate-btn').addEventListener('click', donatefun)

window.addEventListener('beforeunload', leaveChannel)
let messageForm = document.getElementById('message__form')
messageForm.addEventListener('submit', sendMessage)