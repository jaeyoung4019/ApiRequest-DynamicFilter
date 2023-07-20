import React, {useEffect, useState} from 'react';
import {accordion} from "../../../../../utils/common";
interface Props {
    apiFilter: OrgApiFilterInterface
    handleSelectFilter: (type: string) => (value: string) => void;
    selectFilterLink: string,
    selectFilterLocation: string
    id: string
}

const PCFilter = ({id , apiFilter , selectFilterLink , selectFilterLocation  ,handleSelectFilter} : Props) => {


    useEffect(() => {
        accordion(`#${id}`)
    } , [])

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
        <aside id="flt_lnb">
            <h2 className="lnb_tit">Filters</h2>
            <ul className="menu_list acc_wrap" id={id}>
                <li className="acc_box open">
                    <div className="acc_tit"><span className="tit">Location</span><i
                        className="icon arrow arrow_d"></i></div>
                    <div className="acc_cont">
                        <ul className="sub_menu_list filter_list">
                            {
                                uiFilter?.location?.map( (value: OrgFilterInterface , idx: number) => {
                                    return (
                                        <li className="filter_item cus_inp_box chk_inp" key={idx}>
                                            <label htmlFor={`loca_opt_${idx}`} className="label_box">{value?.name}
                                                <input type="checkbox" id={`loca_opt_${idx}`} name="lnb_filters"
                                                       value={value?.name} checked={value?.checked}
                                                       onChange={onClickCheckBox("location")}
                                                  />
                                                <span className="inp_custom"></span>
                                            </label>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                </li>
                <li className="acc_box open">
                    <div className="acc_tit"><span className="tit">Link</span><i
                        className="icon arrow arrow_d"></i></div>
                    <div className="acc_cont">
                        <ul className="sub_menu_list filter_list">
                            {
                                uiFilter?.link?.map( (value: OrgFilterInterface , idx: number) => {
                                    return (
                                        <li className="filter_item cus_inp_box chk_inp" key={idx}>
                                            <label htmlFor={`link_opt_${idx}`} className="label_box">{value?.name}
                                                <input type="checkbox" id={`link_opt_${idx}`} name="lnb_filters"
                                                       value={value?.name} checked={value?.checked}
                                                       onChange={onClickCheckBox("link")}
                                                />
                                                <span className="inp_custom"></span>
                                            </label>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                </li>
            </ul>
        </aside>
    )
}

export default PCFilter;