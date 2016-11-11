import { UserData } from '../providers/user-data';

export class houseShort {
    Src?: String;
    ListDate: Date;
    Beds?: Number;
    Baths?: Number;
    Kitchen?: Number;
    GeocodeLat?: Number;
    GeocodeLng?: Number;
    Address?: String;
    SaleLease: String;
    Price: Number;
    HouseType?: String;
    MunicipalityName?: String;
    CountryName?: String;
    MLS: String;
    Country?: String;
    ProvinceEname?: String;
    ProvinceCname?: String;
    CoverImg?: String;
    CoverImgtn?: String;
    CdnCoverImg?: String;
    CdnCoverImgtn?: String;
    MemberOnlyImg?: String;
    vowShowFlag?: Boolean;




}

export class houseListModel {
    public list?: Array<houseShort>;
    private userData: UserData;
    constructor(houseM: Array<houseShort>, auth: Boolean) {
        this.list = houseM;
        this.setVowMask(auth);

    }

    remove(mls) {
        this.userData.changeFavorite(mls, 'houseFav', 'd').then(res => {
            console.log("Remove MLS Result:" + res);
            this.list = this.list.filter(function (obj) {
                return obj.MLS !== mls;

            });
        });
        return this.list;

    }

    listNumber(): number {
        return this.list.length;
    }

    getList() {
        return this.list;
    }

    setList(l) {
        this.list = l;
    }


    setVowMask(auth: Boolean) { //auth = true if login

        for (var i = 0; i < this.list.length; i++) {

            let src = this.list[i].Src;
            let flag: boolean = (!auth && (src == 'VOW')) ? false : true;
            this.list[i]['vowShowFlag'] = flag;

        }
        return this.list;

    }

    
    sort(sortType,sortOrder) {


       
            if (sortType == 'Price') {
                if (sortOrder == 0) {
                    this.list.sort(function (a, b) {
                        let an, bn;
                        //an = parseFloat(a.Price);
                        an= a.Price;
                        bn= b.Price;
                        //bn = parseFloat(b.Price);
                        return an - bn;

                    })
                }
                if (sortOrder == 1) {
                    this.list.sort(function (a, b) {
                        let an, bn;
                        //an = parseFloat(a.Price);
                        //bn = parseFloat(b.Price);
                        an= a.Price;
                        bn= b.Price;
                        return bn - an;

                    })
                }

            }

            if (sortType == 'ListDate') {
                this.list.sort(function (a, b) {
                    let an, bn;
                    an = new Date(a.ListDate);
                    bn = new Date(b.ListDate);
                    return bn - an;

                });

            }
            if (sortType == 'Beds') {
                this.list.sort(function (a, b) {
                    let an, bn;
                    //an = parseFloat(a.Beds);
                    //bn = parseFloat(b.Beds);
                    an = a.Beds;
                    bn = b.Beds;
                    return bn - an;

                });

            }



        } 

    

}