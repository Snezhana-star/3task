Vue.component('createcard',{
    template:`
       <div class="form">
         <h2>Создание задачи</h2>
        <form @submit.prevent="onSubmit">
            <label for="title">Заголовок</label>
            <input id="title" v-model="title" type="text" required maxlength="30">
            <label for="description">Задача</label><br>
            <textarea id="description" v-model="description" rows="5" columns="10" required maxlength="60"></textarea><br>
            <label for="startdate">Дата создания: </label>
            <input required  type="date" id="startdate" name="startdate" v-model="startdate" placeholder="дд.мм.гггг"/>
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
            startdate: null,
            finishdate: null,
            errors: [],
        }
    },
    methods:{
        onSubmit() {
            let card = {
                title: this.title,
                description: this.description,
                startdate: new Date().toLocaleDateString().split('.').reverse().join('-'),
                finishdate: this.finishdate,
                
            }
            eventBus.$emit('card-submitted', card)
            this.title = null
            this.description = null
            this.startdate = null
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