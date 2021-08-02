import { Bug } from '../model/entities/Bug';
import { Issue } from '../model/entities/Issue';

export class IssueData {
    private static issue1 = new Issue(
        {
            
            ok: true,
            bugs: [
                {
                    id: "cazziIdMock",
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
            ]           
        }
    );

    private static issue2 = new Issue(
        {
            
            ok: true,
            bugs: [
                {
                    id: "cazziIdMock",
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
            ]           
        }
    );

    private static issue3 = new Issue(
        {
            
            ok: true,
            bugs: [
                {
                    id: "cazziIdMock",
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
            ]           
        }
    );

    private static issue4 = new Issue(
        {
            
            ok: true,
            bugs: [
                {
                    id: "cazziIdMock",
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
            ]           
        }
    );

    private static issue5 = new Issue(
        {
            
            ok: true,
            bugs: [
                {
                    id: "cazziIdMock",
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
            ]           
        }
    );

    public static ISSUE_LIST: Array<Issue> = [IssueData.issue1, IssueData.issue2, IssueData.issue3, IssueData.issue4, IssueData.issue5];
}