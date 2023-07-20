import React, {useEffect, useRef, useState} from 'react';
import {accordion, hideDropMenu} from "../../../../../utils/common";
import MobilFilterPopup from "./MobilFilterPopup";

interface Props {
    apiFilter: OrgApiFilterInterface
    handleSelectFilter: (type: string) => (value: string) => void;
    selectFilterLink: string,
    selectFilterLocation: string
    id: string
}

const UserAndOrgMobileFilter = ({id , apiFilter , selectFilterLink , selectFilterLocation  ,handleSelectFilter}: Props) => {

    const [uiFilter , setUiFilter] = useState(apiFilter);

    const onClickCheckBox = (type: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const {checked , value} = e.target;
        if (checked) {
            if (type === "location") {
                const locationList = selectFilterLocation.split("|").filter(el => el != null && el !== "");
                if (!locationList.includes(value)) {
                    const pushList = [...locationList];
                    pushList.push(value)
                    handleSelectFilter(type)(pushList.join('|').toString())
                }
            }

            if (type === "link") {
                const linkList = selectFilterLink.split("|").filter(el => el != null && el !== "");
                if (!linkList.includes(value)) {
                    const pushList = [...linkList];
                    pushList.push(value)
                    handleSelectFilter(type)(pushList.join('|').toString())
                }
            }

        } else if (!checked) {
            if (type === "location") {
                const locationList = selectFilterLocation.split("|").filter(el => el != null && el !== "");
                if (locationList.includes(value)) {
                    const pushList = [...locationList];
                    const index = pushList.indexOf(value);
                    pushList.splice(index , 1)
                    handleSelectFilter(type)(pushList.join('|').toString())
                }
            }
            if (type === "link") {
                const linkList = selectFilterLink.split("|").filter(el => el != null && el !== "");
                if (linkList.includes(value)) {
                    const pushList = [...linkList];
                    const index = pushList.indexOf(value);
                    pushList.splice(index , 1)
                    handleSelectFilter(type)(pushList.join('|').toString())
                }
            }
        }
    }

    useEffect(() => {
        $(document).on("click" ,function(e) {
            if(!$(e.target).closest(`#${id}Inner`).length){
                $('.cont_box').removeClass('open');
            }
        });
    } , [])

    useEffect(() => {
        setUiFilter( () => {
            return {
                location : apiFilter?.location.map( (value: any , idx: any) => {
                    const locationList = selectFilterLocation.split("|").filter(el => el != null && el !== "");
                    if (locationList?.includes(value.name)){
                        return {
                            name: value.name,
                            checked: true
                        }
                    } else {
                        return value
                    }
                }),
                link : apiFilter?.link.map( (value: any , idx: any) => {
                    const linkList = selectFilterLink.split("|").filter(el => el != null && el !== "");
                    if (linkList?.includes(value.name)){
                        return {
                            name: value.name,
                            checked: true
                        }
                    } else {
                        return value
                    }
                })
            }
        })
    } , [apiFilter])

    return (
        <aside id="flt_lnb_m">
            <h2 className="lnb_tit sound_only">Filters</h2>
            <MobilFilterPopup id={"Location"} list={uiFilter?.location} onClickCheckBox={onClickCheckBox("location")} select={selectFilterLocation}/>
            <MobilFilterPopup id={"Link"} list={uiFilter?.link} onClickCheckBox={onClickCheckBox("link")} select={selectFilterLink}/>
        </aside>
    )
}

export default UserAndOrgMobileFilter;