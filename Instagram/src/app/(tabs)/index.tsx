import { View, FlatList } from "react-native";
import posts from "~/assets/data/posts.json";
import PostListItem from "~/src/components/PostListItem";

export default function Feed() {
    return (
        <FlatList 
            data={posts} 
            contentContainerStyle={{ gap: 10 }}
            renderItem={({ item }) => <PostListItem post={item} /> }
            showsVerticalScrollIndicator={false}
        />
    );
}