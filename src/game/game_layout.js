window.onload= ()=>{
	console.log("level_data ",level_data)
	console.log("game_fields ",game_fields)
}

class Render {
	constructor(background,header,game_layout){
		this.background = background
		this.header = header
		this.buttons = game_layout
		this.game_activity = (()=>document.getElementById('game-activity'))()
		this.event = new Event('switch')
		this.reverse_button = (()=>document.getElementById('switch-side'))()
		this.state = new Array()
	}


	activate(state){
		if (arguments.length===0)this.render_activity_top(this.buttons)
		else this.render_activity_top(state,true)
	}

	render_activity_top(buttons_array,reverse){
		if (arguments.length===0) throw new Error('Args error: No arguments')
		if (reverse) {
			const reverse_array = []
			for(let row of buttons_array) {
				const reverse_row = row.reverse()
				for (let elem of reverse_row) {
					if (elem.clicked) elem.clicked = false 
					else elem.clicked = true
				}
				reverse_array.push(reverse_row)
			}
			buttons_array = reverse_array
		}

		if (this.game_activity.children[0]) {
			this.game_activity.classList.toggle('reversed')
			this.game_activity.removeChild(this.game_activity.children[0])
		}
		this.game_activity.style.backgroundImage = this.background
		
		const game_layout = document.createElement('div')
		game_layout.classList='game_layout'

		// debugger
		for (let i in buttons_array) {
			const line = document.createElement('div')
			line.id = i + '_row'
			line.classList.add('row')
			for (let j=0; j < buttons_array[i].length; j++) {
				const button = this.add_button()
				if (buttons_array[i][j].secret !== '' ){
					button.dataset.secret1 = buttons_array[i][j].secret
					if (buttons_array[i][j].disabled) button.classList.add('button-disabled')
					else if(buttons_array[i][j].clicked) button.classList.add('button-clicked')
					line.append(button)
				} else {
					if (buttons_array[i][j].disabled) button.classList.add('button-disabled')
					else if(buttons_array[i][j].clicked) button.classList.add('button-clicked')
					line.append(button)
				}
			}
			game_layout.appendChild(line)
		}

		this.game_activity.appendChild(game_layout)
		this.event_dispatcher(this.game_activity)
		this.reverse_button.onclick=()=>{
			game_layout.classList.add('anim-in')
			this.state_update = document.getElementsByClassName('game_layout')[0].children
			setTimeout(()=>this.activate(this.state),200)
		}

	}

	add_button(){//at least button here equal checkbox XD
		const label = document.createElement('label')
		const check_box = document.createElement('input')
		check_box.type= 'checkbox'
		const personal_id = Math.random().toString(32).slice(2) + Math.random().toString(16).slice(2)
		label.append(check_box)
		check_box.id = personal_id
		label.for = personal_id
		return label
	}

	event_dispatcher(elem){
		this.event.initEvent('switch',true,true)
		elem.dispatchEvent(this.event)
	}

	set state_update(array){//here u can optimaize the CODE
		const state = []
		let i = 0
		for (let row of array){
			state.push([])
			for (let elem of row.children){
				state[i].push({
					'clicked':elem.classList.contains('button-clicked') ? true : false,
					'disabled':elem.classList.contains('button-disabled') ? true : false,
					'secret':elem.dataset.secret1 ? elem.dataset.secret1 : '',
				})
			}
			i++
		}
		this.state = state

	}

}


class ButtonLogic {
	constructor(){
		this.all_buttons = (()=>document.getElementsByTagName('input'))()
		this.secret_state = new Set()
	}

	setListenersCheckbox(){

		for (const button of this.all_buttons) {
			if (!button.classList.contains('disabled')) button.addEventListener('click',this.listenerEvent)
		}
	}

	listenerEvent(e){ /*debugger*/
		const array = []
		if(!e.target.checked) e.preventDefault()
		else e.target.parentElement.classList.add('button-clicked')
		if (!e.target.parentElement.classList.contains('button-disabled')){}
	// 	if (e.target.parentElement.dataset.secret1) { debugger
	// 		const currVal = document.querySelector('label[data-secret1='+e.target.dataset.secret1+']')
	// 		const lowerVal = document.querySelector('label[data-secret1='+(e.target.dataset.secret1-1)+']') || false
	// 		if (!loverVal) {
	// 			e.target.parentElement.classList.add('secret-clicked')
	// 		} //TODO ad counter that checks position of progress secrets and saves smth like state??
	// 	}
	// 	// console.log(e.target.checked)
	}

	flipBoardOver(){
		for (const button of this.all_buttons) {
			button.removeEventListener('click',this.listenerEvent)
			button.parentElement.classList.remove('button-clicked')
		}
	}

	set secretSetter(secret){
		this.secret_state.add(secret)
	}

}


class SwitchField extends ButtonLogic {
	constructor(){
		super(all_buttons)
	}

	flipField(){
		console.log(all_buttons)
	}

}

document.addEventListener('switch',	()=>{
	const buttonListener = new ButtonLogic()
	buttonListener.setListenersCheckbox()
})

const gameFieldOne = new Render(game_fields[1].background,game_fields[1].html.header,game_fields[1].html.game_layout)
gameFieldOne.activate()




//TODO ad counter that checks position of progress secrets and saves smth like state??
