let eventBus = new Vue()
Vue.component('columns', {
    template: `
    <div>
    <h2 class="error" v-for="error in errors">{{error}}</h2>
  <div class="cont1">
  <createcard></createcard>
    <div class="col">
    <ul>
    <li v-for="card in column1"><p>{{card.title}}</p>
    <ul >
    <li v-for="t in card.subtasks"  v-if="t.title !=null">
        <input @click="Status1(card,t)" type="checkbox" >
        <p :class="{text:t.completed}">{{t.title}}</p>
    </li>
    </ul>
    </li>      
    </ul>    
    </div>
    `,
})

Vue.component('createcard',{
    template:`
       <div class="form">
         <h2>Создание задачи</h2>
        <form @submit.prevent="onSubmit">
            <label for="title">Заголовок</label>
            <input id="title" v-model="title" type="text" required maxlength="30">
            <label for="description">Задача</label><br>
            <textarea id="description" v-model="description" rows="5" columns="10" required maxlength="60"></textarea><br>
            <label for="finishdate">Дэдлайн: </label>
            <input required  type="date" id="finishdate" name="finishdate" v-model="finishdate" placeholder="дд.мм.гггг"/>
            <button type="submit">Создать задачу</button>
        </form>
    </div>
    `,
    data(){
        return{
            title: null,
            description: null,
            date: null,
            finishdate: null,
        }
    },
    methods:{
        onSubmit() {
            let card = {
                title: this.title,
                description: this.description,
                date: new Date().toLocaleDateString().split('.').reverse().join('-'),
                finishdate: this.finishdate,
                
            }
            eventBus.$emit('card-submitted', card)
            this.title = null
            this.description = null
            this.date = null
            this.finishdate = null
        },
    }
})



let app = new Vue({
    el: '#app',
    data: {
        name: 'Kanban доска'
    }
})