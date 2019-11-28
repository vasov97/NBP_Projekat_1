export class User{
    constructor(id,name,surname){
        this.id=id;
        this.name=name;
        this.surname=surname;
        this.profilePicture=null;
        this.allRecipes=[];

        if(this.name==null || this.name=="" || this.name==undefined){
            this.name=Alex;
        }

        if(this.surname==null || this.surname=="" || this.surname==undefined){
            this.surname=Doe;
        }


    }

    addRecipie(newRecepie){
        this.allRecipes.push(newRecepie);
    }
}