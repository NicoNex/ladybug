import { Bug } from '../Model/entities/Bug';

export class BugData {
    private static bug1 = new Bug(
        {
            
            id:9,
            body: "primno bug",
            open: false,
            tags: [
                "front-end",
                "back-end",
                "angular",
                "cazzi-magici"
            ],
            date: Math.round(new Date().getTime() / 1000),
            comments: [
                {
                    date: Math.round(new Date().getTime() / 1000),
                    text: "il mio mirabolante commento",
                    author: "NicoNex"
                },
                {
                    date: Math.round(new Date().getTime() / 1000),
                    text: "Altro mirabolante permesso",
                    author: "Giuseppe"
                }
            ] 
            
        }
    );

    private static bug2 = new Bug(
        {
            
            id: 7,
            body: "secondo buggg",
            open: true,
            tags: [
                "front-end",
                "back-end",
                "angular",
                "cazzi-magici"
            ],
            date: Math.round(new Date().getTime() / 1000),
            comments: [
                {
                    date: Math.round(new Date().getTime() / 1000),
                    text: "il mio mirabolante commento",
                    author: "NicoNex"
                },
                {
                    date: Math.round(new Date().getTime() / 1000),
                    text: "Altro mirabolante permesso",
                    author: "Giuseppe"
                }
            ] 
            
        }
    );

    private static bug3 = new Bug(
        {
            
            id: 4,
            body: "terzobugfgoine",
            open: true,
            tags: [
                "front-end",
                "back-end",
                "angular",
                "cazzi-magici"
            ],
            date: Math.round(new Date().getTime() / 1000),
            comments: [
                {
                    date: Math.round(new Date().getTime() / 1000),
                    text: "il mio mirabolante commento",
                    author: "NicoNex"
                },
                {
                    date: Math.round(new Date().getTime() / 1000),
                    text: "Altro mirabolante permesso",
                    author: "Giuseppe"
                }
            ] 
            
        }
    );

    private static bug4 = new Bug(
        {
            
            id: 1,
            body: "superbuggone",
            open: false,
            tags: [
                "front-end",
                "back-end",
                "angular",
                "cazzi-magici"
            ],
            date: Math.round(new Date().getTime() / 1000),
            comments: [
                {
                    date: Math.round(new Date().getTime() / 1000),
                    text: "il mio mirabolante commento",
                    author: "NicoNex"
                },
                {
                    date: Math.round(new Date().getTime() / 1000),
                    text: "Altro mirabolante permesso",
                    author: "Giuseppe"
                }
            ] 
            
        }
    );

    private static bug5 = new Bug(
        {
            
            id: 0,
            body: "wewe",
            open: true,
            tags: [
                "front-end",
                "back-end",
                "angular",
                "cazzi-magici"
            ],
            date: Math.round(new Date().getTime() / 1000),
            comments: [
                {
                    date: Math.round(new Date().getTime() / 1000),
                    text: "il mio mirabolante commento",
                    author: "NicoNex"
                },
                {
                    date: Math.round(new Date().getTime() / 1000),
                    text: "Altro mirabolante permesso",
                    author: "Giuseppe"
                }
            ] 
            
        }
    );


    public static BUG_LIST: Array<Bug> = [BugData.bug1, BugData.bug2, BugData.bug3, BugData.bug4, BugData.bug5];

}