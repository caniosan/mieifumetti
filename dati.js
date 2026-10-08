// Collegamenti originali ai Fogli Google e ai cataloghi esterni.
const raccolte = [
            { id: "dyd", nome: "Dylan Dog" },
            { id: "dyd-rist", nome: "Dylan Dog Ristampa" },
            { id: "dyd-book", nome: "Dylan Dog Collezione Book" },
            { id: "dyd-super", nome: "Dylan Dog Super Book" },
            { id: "dyd-gig", nome: "Dylan Dog Albo Gigante" },
            { id: "diab", nome: "Diabolik" },
            { id: "diab-r", nome: "Diabolik (R)" },
            { id: "diab-sw", nome: "Diabolik Swiisss (Seconda Ristampa)" },
            { id: "brendon", nome: "Brendon" },
            { id: "simpsons", nome: "Simpsons Panini Comics" },
            { id: "banco-unici", nome: "Il Banco degli Unici" }
        ];

const CSV_LINKS = {
            "dyd": "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ4Lmk8HsGARe1PrhPxbUcAY-YHN-_T8WuSKUQO89-PWO8kvQgB5jzN41khZhZTUJhdtIL-36ax-qIU/pub?gid=0&single=true&output=csv",
            "dyd-rist": "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ4Lmk8HsGARe1PrhPxbUcAY-YHN-_T8WuSKUQO89-PWO8kvQgB5jzN41khZhZTUJhdtIL-36ax-qIU/pub?gid=1422213309&single=true&output=csv",
            "dyd-book": "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ4Lmk8HsGARe1PrhPxbUcAY-YHN-_T8WuSKUQO89-PWO8kvQgB5jzN41khZhZTUJhdtIL-36ax-qIU/pub?gid=530551093&single=true&output=csv",
            "dyd-super": "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ4Lmk8HsGARe1PrhPxbUcAY-YHN-_T8WuSKUQO89-PWO8kvQgB5jzN41khZhZTUJhdtIL-36ax-qIU/pub?gid=319434338&single=true&output=csv",
            "dyd-gig": "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ4Lmk8HsGARe1PrhPxbUcAY-YHN-_T8WuSKUQO89-PWO8kvQgB5jzN41khZhZTUJhdtIL-36ax-qIU/pub?gid=1112494760&single=true&output=csv",
            "diab": "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ4Lmk8HsGARe1PrhPxbUcAY-YHN-_T8WuSKUQO89-PWO8kvQgB5jzN41khZhZTUJhdtIL-36ax-qIU/pub?gid=807354185&single=true&output=csv",
            "diab-r": "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ4Lmk8HsGARe1PrhPxbUcAY-YHN-_T8WuSKUQO89-PWO8kvQgB5jzN41khZhZTUJhdtIL-36ax-qIU/pub?gid=2012731827&single=true&output=csv",
            "diab-sw": "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ4Lmk8HsGARe1PrhPxbUcAY-YHN-_T8WuSKUQO89-PWO8kvQgB5jzN41khZhZTUJhdtIL-36ax-qIU/pub?gid=1343200500&single=true&output=csv",
            "brendon": "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ4Lmk8HsGARe1PrhPxbUcAY-YHN-_T8WuSKUQO89-PWO8kvQgB5jzN41khZhZTUJhdtIL-36ax-qIU/pub?gid=818594743&single=true&output=csv",
            "simpsons": "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ4Lmk8HsGARe1PrhPxbUcAY-YHN-_T8WuSKUQO89-PWO8kvQgB5jzN41khZhZTUJhdtIL-36ax-qIU/pub?gid=798655827&single=true&output=csv",
            "banco-unici": "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ4Lmk8HsGARe1PrhPxbUcAY-YHN-_T8WuSKUQO89-PWO8kvQgB5jzN41khZhZTUJhdtIL-36ax-qIU/pub?gid=922417261&single=true&output=csv"
        };

const COMICS_ORG_LINKS = {
            "dyd": "https://www.comics.org/series/3211/",
            "dyd-rist": "https://www.comics.org/series/102898/",
            "dyd-book": "https://www.comics.org/series/86765/",
            "dyd-super": "https://www.comics.org/series/79808/",
            "dyd-gig": "https://www.comics.org/series/79809/",
            "diab": "https://www.comics.org/series/18176/",
            "diab-r": "https://www.comics.org/series/25401/",
            "diab-sw": "https://www.comics.org/series/31125/",
            "brendon": "https://www.comics.org/series/6049/",
            "simpsons": "https://www.comicsbox.it/serie/ISPNMN"
        };
