export class Post{
    constructor(id, text, type){
        this.id=id;
        this.text=text;
        this.type=type;
        this.numberOfSteps=1;
        this.likeCount=0;
        this.pictureArray=[];

        if(this.text==null || this.text==undefined){
            this.text="";
        }

        if(this.type==null || this.type==undefined || this.type==""){
            this.type="undefined";
        }
    }
}