const connection = require("../database/connection")

module.exports = {
    
    async index(request, response){
        const ong_id = request.headers.authorization

        const [ count ] = await connection('incidents').where('ong_id', ong_id).count()

        response.header('Access-Control-Expose-Headers', 'X-Total-Count')
        response.header('X-Total-Count', count['count(*)']);

        const incidents = await connection('incidents')
            .where('ong_id', ong_id)
            .select('*')
            
        return response.json(incidents)
    }
}