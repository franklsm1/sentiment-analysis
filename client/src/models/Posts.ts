import {Post} from "./Post";

export interface Posts {
    negative: [Post?],
    positive: [Post?],
    neutral: [Post?],
    [key: string]: any 
}