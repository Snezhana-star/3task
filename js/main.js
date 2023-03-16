let eventBus = new Vue()


Vue.component('cols', {
    template:`
    <div id="cols">
        <newcard></newcard>
        <div class="cols__content">
            <col1 :column1="column1"></col1>
            <col2 :column2="column2"></col2>
            <col3 :column3="column3"></col3>
            <col4 :column4="column4"></col4>
        </div>
    </div>
`,
    data() {
        return {
            column1: [],
            column2: [],
            column3: [],
            column4: [],
        }
    },
    methods: {

    },
    mounted() {
        eventBus.$on('addColumn1', card => {
            this.column1.push(card)
        })
        eventBus.$on('addColumn2', card => {
            this.column2.push(card)
        })
        eventBus.$on('addColumn3', card => {
            this.column3.push(card)
        })
        eventBus.$on('addColumn4', card => {
            this.column4.push(card)
            if (card.date > card.deadline) {
                card.current = false
            }
        })
    },
    computed: {

    }
})

Vue.component('col4', {
    template: `
        <div class="col">
            <h2>Completed tasks</h2>
            <div class="cards" style="background-color: lightgreen" v-for="card in column4">
                <p class="card-title">{{card.title}}</p>
                <ul>
                    <li class="tasks">Description: {{card.description}}</li>
                    <li class="tasks">Date of creation:
                    {{ card.date }}</li>
                    <li class="tasks">Deadline: {{card.deadline}}</li>
                    
                    <li class="tasks" v-if="card.current"> Сompleted on time</li>
                    <li class="tasks" v-else>Not completed on time</li>
                </ul>
            </div>
        </div>
    `,
    props: {
        column4: {
            type: Array,
        },
        card: {
            type: Object
        }
    },
    methods: {

    },

    computed:  {

    },
})


Vue.component('col3', {
    template: `
        <div class="col"> 
            <h2>Testing</h2>
            <li class="cards" style="background-color: #f5f287" v-for="card in column3" >
                <a @click="card.editB = true">Edit</a> <br>
                <p class="card-title">{{card.title}}</p>
                <ul>
                    <li class="tasks">Description: {{card.description}}</li>
                    <li class="tasks">Date of creation:
                    {{ card.date }}</li>
                    <li class="tasks">Deadline: {{card.deadline}}</li>
                    <li class="tasks" v-if="card.reason != null">Reason of transfer: {{ card.reason }}</li>
                    <li class="tasks" v-if="card.edit != null">Last change: {{ card.edit}}</li>
                    <li class="tasks" v-if="card.editB">
                        <form @submit.prevent="updateTask(card)">
                            <p>New title: 
                                <input type="text" v-model="card.title" maxlength="30" placeholder="Заголовок">
                            </p>
                            <p>New description: 
                                <textarea v-model="card.description" cols="20" rows="5"></textarea>
                            </p>
                            <p>
                                <input type="submit" value="Edit">
                            </p>
                        </form>
                    </li>
                    <li class="tasks" v-if="card.transfer">
                        <form @submit.prevent="lastcol(card)">
                            <p>The reason of transfer:
                                <input type="text" v-model="card.reason">
                            </p>
                            <p>
                                <input type="submit" value="OK">
                            </p>
                        </form>
                    </li>
                </ul>
                <a @click="card.transfer = true">Last Column</a>  | <a @click="nextcol(card)">Next Column</a>
            </div>
        </div>
    `,
    props: {
        column3: {
            type: Array,
        },
        card: {
            type: Object
        }
    },
    methods: {
        nextcol(card) {
            this.column3.splice(this.column3.indexOf(card), 1)
            eventBus.$emit('addColumn4', card)
        },
        lastcol(card) {
            card.transfer = false
            this.column3.splice(this.column3.indexOf(card), 1)
            eventBus.$emit('addColumn2', card)
        },
        updateTask(card){
            card.edit = new Date().toLocaleString()
            card.editB = false
            this.column3.push(card)
            this.column3.splice(this.column3.indexOf(card), 1)
        }
    }
})
Vue.component('col2', {
    template: `
        <div class="col">
            <h2>Tasks in progress</h2>
            <li class="cards" style="background-color: lightblue" v-for="card in column2">
                <a @click="card.editB = true">Edit</a> <br>
                <p class="card-title">{{card.title}}</p>
                <ul>
                    <li class="tasks">Description: {{card.description}}</li>
                    <li class="tasks">Date of creation:
                    {{ card.date }}</li>
                    <li class="tasks">Deadline: {{card.deadline}}</li>
                    <li class="tasks" v-if="card.reason != null">Reason of transfer: {{ card.reason }}</li>
                    <li class="tasks" v-if="card.edit != null">Last change: {{ card.edit}}</li>
                    <li class="tasks" v-if="card.editB">
                        <form @submit.prevent="updateTask(card)">
                            <p>New title: 
                                <input type="text" v-model="card.title" maxlength="30" placeholder="Заголовок">
                            </p>
                            <p>New description: 
                                <textarea v-model="card.description" cols="20" rows="5"></textarea>
                            </p>
                            <p>
                                <input type="submit" value="Edit">
                            </p>
                        </form>
                    </li>
                </ul>
                <a @click="nextcol(card)">Next Column</a>
            </div>
        </div>
    `,
    props: {
        column2: {
            type: Array,
        },
        card: {
            type: Object
        }
    },
    methods: {
        nextcol(card) {
            this.column2.splice(this.column2.indexOf(card), 1)
            eventBus.$emit('addColumn3', card)
        },
        updateTask(card){
            card.edit = new Date().toLocaleString()
            card.editB = false
            this.column2.push(card)
            this.column2.splice(this.column2.indexOf(card), 1)
        }
    }
})
Vue.component('column1', { 
    template: `
        <div class="col">
            <h2>Запланированные задачи</h2>
            <li v-for="card in column1">
                <a @click="deleteCard(card)">Удалить</a>   <a @click="card.editB = true">Изменить</a> <br>
                <p class="card-title">{{card.title}}</p>
                <ul>
                    <li >Задание: {{card.description}}</li>
                    <li >Дата создания: {{ card.date }}</li>
                    <li >Дэдлайн: {{card.finishdate}}</li>
                    <li v-if="card.edit != null">Последнее изменение: {{ card.edit}}</li>
                    <li v-if="card.editB">
                        <form @submit.prevent="updateCard(card)">
                            <p>Новое название: 
                                <input type="text" v-model="card.title" maxlength="30">
                            </p>
                            <p>Новая задача: 
                                <textarea v-model="card.description" cols="20" rows="5"></textarea>
                            </p>
                            <p>
                                <input type="submit" value="Edit">
                            </p>
                        </form>
                    </li>
                </ul>
<!--                <a @click="nextcolumn(card)">Следующая колонка</a>--></li>
            </div>
        </div>
    `,
    props: {
        column1: {
            type: Array,
        },
        column2: {
            type: Array,
        },
        card: {
            type: Object
        },
        errors: {
            type: Array
        }
    },
    methods: {
        // nextcolumn(card){
        //     this.column1.splice(this.column1.indexOf(card),1)
        //     eventBus.$emit('addColumn2', card)
        // },
        deleteCard(card){
            this.column1.splice(this.column1.indexOf(card),1)
        },
        updateCard(card){
            card.editB = false
            this.column1.push(card)
            this.column1.splice(this.column1.indexOf(card), 1)
            card.edit = new Date().toLocaleString()
        }
    },
})

Vue.component('createcard',{
    template:`
<section>
    <a href="#openModal" class="btnModal">Создать задачу</a>
    <div id="openModal" class="modal">
       <div class="modal-body">    
       <div class="form">
         <h2>Создание задачи <a href="#close" title="Close" class="close">×</a></h2>
        <form @submit.prevent="onSubmit">
            <label for="title">Заголовок</label>
            <input id="title" v-model="title" type="text" required maxlength="30">
            <label for="description">Задача</label><br>
            <textarea id="description" v-model="description" rows="5" columns="30" required maxlength="150"></textarea><br>
            <label for="finishdate">Дэдлайн: </label>
            <input required  type="date" id="finishdate" name="finishdate" v-model="finishdate" placeholder="дд.мм.гггг"/>
            <button type="submit">Создать задачу</button>
        </form>
    </div>
    </div>
    </div>
    </section>
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
                edit: null,
                editB:null,
                
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