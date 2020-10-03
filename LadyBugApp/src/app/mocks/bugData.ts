import { Bug } from '../Model/entities/Bug';

export class BugData {
    private static bug1 = new Bug(
        {
            
            id: "buggone1",
            body: "il mio fantastico bug",
            open: false,
            tags: [
                "font-end",
                "back-end",
                "angular",
                "cazzi-magici"
            ],
            date: new Date(),
            comments: [
                {
                    date: new Date(),
                    text: "il mio mirabolante commento",
                    author: "NicoNex"
                },
                {
                    date: new Date(),
                    text: "Altro mirabolante permesso",
                    author: "Giuseppe"
                }
            ] 
            
        }
    );

    private static bug2 = new Bug(
        {
            
            id: "buggo",
            body: "il mio fantastico bug",
            open: true,
            tags: [
                "font-end",
                "back-end",
                "angular",
                "cazzi-magici"
            ],
            date: new Date(),
            comments: [
                {
                    date: new Date(),
                    text: "il mio mirabolante commento",
                    author: "NicoNex"
                },
                {
                    date: new Date(),
                    text: "Altro mirabolante permesso",
                    author: "Giuseppe"
                }
            ] 
            
        }
    );

    private static bug3 = new Bug(
        {
            
            id: "buggopiuomeno",
            body: "il mio fantastico bug",
            open: true,
            tags: [
                "font-end",
                "back-end",
                "angular",
                "cazzi-magici"
            ],
            date: new Date(),
            comments: [
                {
                    date: new Date(),
                    text: "il mio mirabolante commento",
                    author: "NicoNex"
                },
                {
                    date: new Date(),
                    text: "Altro mirabolante permesso",
                    author: "Giuseppe"
                }
            ] 
            
        }
    );

    private static bug4 = new Bug(
        {
            
            id: "giocoaterrraria",
            body: "il mio fantastico bug",
            open: false,
            tags: [
                "font-end",
                "back-end",
                "angular",
                "cazzi-magici"
            ],
            date: new Date(),
            comments: [
                {
                    date: new Date(),
                    text: "il mio mirabolante commento",
                    author: "NicoNex"
                },
                {
                    date: new Date(),
                    text: "Altro mirabolante permesso",
                    author: "Giuseppe"
                }
            ] 
            
        }
    );

    private static bug5 = new Bug(
        {
            
            id: "gesu",
            body: "il mio fantastico bug",
            open: true,
            tags: [
                "font-end",
                "back-end",
                "angular",
                "cazzi-magici"
            ],
            date: new Date(),
            comments: [
                {
                    date: new Date(),
                    text: "il mio mirabolante commento",
                    author: "NicoNex"
                },
                {
                    date: new Date(),
                    text: "Altro mirabolante permesso",
                    author: "Giuseppe"
                }
            ] 
            
        }
    );


    public static BUG_LIST: Array<Bug> = [BugData.bug1, BugData.bug2, BugData.bug3, BugData.bug4, BugData.bug5];

}