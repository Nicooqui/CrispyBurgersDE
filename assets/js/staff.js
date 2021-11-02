class Staff {
    constructor(id, nombre, descripcion, profesion){
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.profesion = profesion;

    }
}

const nuestroStaff = []

$.ajax({
    type: "get",
    url: '../database/db.json',
    success: (response) => {
        let data = response[1]
        console.log(data)
        for (const staff of data){
            nuestroStaff.push(new Staff(staff.id, staff.nombre, staff.descripcion, staff.profesion))
        }

        for(const personal of nuestroStaff){
            $('#staff').append(`<div class="card">
            <img src="../assets/resources/images/personal${personal.id}.jpg"class="card-img-top" alt=${personal.nombre}>
            <div class="card-body">
                <h5 class="card-title">${personal.nombre}</h5>
                <h6 class="card-title">${personal.profesion}</h6>
                <p><strong>${personal.descripcion.desc}</strong></p>
                <p><strong>Edad: ${personal.descripcion.edad}</strong></p>
                <p><strong>Intereses: ${personal.descripcion.hobby}</strong></p>
            </div>`)
        }
}})