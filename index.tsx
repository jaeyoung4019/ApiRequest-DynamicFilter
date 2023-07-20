import React, { useCallback, useEffect, useState } from "react";
import ContentTop from "../common/ContentTop";
import { useAppSelector } from "../../../../store/hooks";
import { RootState } from "../../../../store";
import useSearchForm from "../../../../libs/Hooks/useSearchForm";
import useWindowDimensions from "../../../../libs/Hooks/useWindowDimensions";
import { ApiConfig } from "../../../../libs/api/authApi/apiConfig";
import { queryKey } from "../../../../libs/Hooks/react-query/reactQueryUtils";
import useSelectQuery from "../../../../libs/Hooks/react-query/useSelectQuery";
import { apiRequest } from "../../../../libs/api/apiInstance";
import Loading from "../../../Ui/Loadable/Loading";
import SearchBarContainer from "../common/SearchBar/SearchBarContainer";
import OrganizationListContainer from "./OrganizationListContainer";
import Pagination from "../../../Ui/Commons/Pagination/Pagination";
import { regComma } from "../../../../utils/reg";
import { Link } from "react-router-dom";
import ExploreSort from "../../../Ui/Commons/SelectBox/ExploreSort";
import UserAndOrgPCFilter from "../common/Filters/UserAndOrgPCFilter";
import UserAndOrgMobileFilter from "../common/Filters/UserAndOrgMobileFilter";

type initialState = {
    isToken: false;
    isJoin: false;
    isLogin: false;
    token: "";
};
const ExploreOrganization = () => {
    const defaultPageSize = 20;
    const { isLogin }: initialState = useAppSelector((state: RootState) => state.userSlice);
    const keywordInitVariable = {
        keyword: ""
    };

    const [value, onChangeFunction, reset, debounce, enterKey] = useSearchForm(keywordInitVariable);

    const { width } = useWindowDimensions();
    const pageInitVariable = {
        page: 1,
        pageSize: defaultPageSize
    };
    const [page, setPage] = useState(pageInitVariable);
    const handleMoreButton = useCallback(() => {
        setPage((preValue: any) => {
            return {
                ...preValue,
                pageSize: preValue.pageSize + defaultPageSize
            };
        });
    }, [page]);

    const initApiFilter: OrgApiFilterInterface = {
        location: [],
        link: []
    };

    const [apiFilter, setApiFilter] = useState<OrgApiFilterInterface>(initApiFilter); // api 에서 내려준 값

    const [selectFilterLink, setSelectFitlerLink] = useState<string>("");
    const [selectFilterLocation, setSelectFilterLocation] = useState<string>("");

    const handleSelectFilter = (type: string) => (value: string) => {
        if (type === "location")
            setSelectFilterLocation(() => value)
        else if (type === "link")
            setSelectFitlerLink(() => value)
    };

    const [sort, setSort] = useState<organizationMemberListSortType>("");

    const handleSort = useCallback(
        (value: organizationMemberListSortType) => {
            setSort(() => value);
        },
        [sort]
    );

    const listConfig = new ApiConfig.Builder()
        .setUrl("/pub/explore/organization")
        .setParam({
            keyword: value.keyword,
            page: page.page,
            pageSize: page.pageSize,
            sort: sort,
            fl_link: selectFilterLink === "" ? null : selectFilterLink,
            fl_location: selectFilterLocation === "" ? null : selectFilterLocation
        })
        .build();
    const query_key = queryKey("select_key_explore_organizations_list").addKey(page, value, sort, selectFilterLink, selectFilterLocation);
    const organizationListQuery = useSelectQuery(query_key, () => apiRequest.aas.get(listConfig), isLogin);

    const userInfoApi = new ApiConfig.Builder().setUrl("/prv/user/setting/profile").build();
    const user_query_key = queryKey("user_profile_select_key_explore_organizations").defaultKey;
    const userInfoQuery = useSelectQuery(user_query_key, () => apiRequest.iam.get(userInfoApi), isLogin);

    const handlePage = useCallback(
        (type: string) => (value: number) => {
            setPage(data => {
                return {
                    ...data,
                    [type]: value
                };
            });
        },
        [page]
    );

    useEffect(() => {
        if (width < 1154 || width > 1156) {
            setPage(() => {
                return {
                    page: 1,
                    pageSize: defaultPageSize
                };
            });
        }
    }, [width]);

    useEffect(() => {
        if (organizationListQuery.status === "success") {
            const locationArray = organizationListQuery?.data?.flLocation;
            const linkArray = organizationListQuery?.data?.flLink;
            if (locationArray?.length > 0 && locationArray !== undefined) {
                const defaultLocationList = locationArray?.map((value: { name: string }, idx: number) => {
                    return {
                        name: value.name,
                        checked: false
                    };
                });
                setApiFilter((pre: OrgApiFilterInterface) => {
                    return {
                        ...pre,
                        location: defaultLocationList
                    };
                });
            }

            if (linkArray?.length > 0 && linkArray !== undefined) {
                const defaultLinkList = linkArray?.map((value: { name: string }, idx: number) => {
                    return {
                        name: value.name,
                        checked: false
                    };
                });
                setApiFilter((pre: OrgApiFilterInterface) => {
                    return {
                        ...pre,
                        link: defaultLinkList
                    };
                });
            }
        }
    }, [organizationListQuery.isFetching, organizationListQuery.status]);

    if (userInfoQuery.isLoading || organizationListQuery.isLoading) {
        return <Loading />;
    }

    return (
        <div className="explore_wrap">
            <ContentTop tabState={"Organizations"} />
            <SearchBarContainer value={value} debounce={debounce} />

            <section id="contents">
                <div className="inner flex_wrap">
                    <UserAndOrgPCFilter
                        id={"explore_organization_pc_filter"}
                        apiFilter={apiFilter}
                        handleSelectFilter={handleSelectFilter}
                        selectFilterLocation={selectFilterLocation}
                        selectFilterLink={selectFilterLink}
                    />
                    <UserAndOrgMobileFilter id={"explore_org_mobile_filter"}
                                            apiFilter={apiFilter}
                                            handleSelectFilter={handleSelectFilter}
                                            selectFilterLocation={selectFilterLocation}
                                            selectFilterLink={selectFilterLink}
                    />
                    <div id="main">
                        <div className="sort_box">
                            <div className="sort_result_txt">
                                <span className="result_count">{organizationListQuery?.data?.total?.toString().replace(regComma, ",")}</span>{" "}
                                available results.
                            </div>
                            <div className="filter_info row-1">
                                <ExploreSort sort={sort} handleSort={handleSort} id={"explore_sort_box_organization"} />
                            </div>
                        </div>
                        <OrganizationListContainer orgList={organizationListQuery?.data?.list} />
                        <div className="list_more" style={page.pageSize >= organizationListQuery?.data?.total ? { display: "none" } : {}}>
                            <Link to="#" onClick={handleMoreButton} className="btn basic2">
                                more
                            </Link>
                        </div>
                        <Pagination
                            handlePage={handlePage}
                            page={page}
                            pageInfo={{
                                total: organizationListQuery?.data?.total
                            }}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ExploreOrganization;
