import api from "./api";

class QuizService {
    constructor() {
        this.api = api
        this.baseUrl = "http://localhost:3000/api/quiz"
    }

    async createQuiz() {
        
    }
}

let quizService = new QuizService()

export default quizService