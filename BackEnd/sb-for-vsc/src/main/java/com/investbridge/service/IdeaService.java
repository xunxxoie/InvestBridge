package com.investbridge.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.investbridge.model.db.Idea;
import com.investbridge.model.dto.Idea.IdeaCreateRequest;
import com.investbridge.model.dto.Idea.IdeaCreateResponse;
import com.investbridge.model.dto.Idea.IdeaDetailResponse;
import com.investbridge.model.dto.Object.FileMetaData;
import com.investbridge.repository.IdeaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class IdeaService {

    private final IdeaRepository ideaRepository;

    public IdeaCreateResponse addIdea(IdeaCreateRequest request){

        List<FileMetaData> fileMetadata = new ArrayList<>();
        if(request.getFiles() != null){
            for(MultipartFile file : request.getFiles()){
                try{
                    FileMetaData metadata = new FileMetaData();
                    metadata.setFileName(file.getOriginalFilename());
                    metadata.setFileType(file.getContentType());
                    metadata.setFileSize(file.getSize());
                    metadata.setFileData(file.getBytes()); //BLOB Rule!! Convert file to byte array
                    
                    fileMetadata.add(metadata);
                }catch(IOException e){
                    throw new RuntimeException("Error is occurred with File : " + file.getOriginalFilename());
                }
            }
        }

        Idea newIdea = Idea.builder()
            .userId(request.getUserId())
            .title(request.getTitle())
            .projectSummary(request.getProjectSummary())
            .teamSummary(request.getTeamSummary())
            .content(request.getContent())
            .gitLink(request.getGitLink())
            .notionLink(request.getNotionLink())
            .categories(request.getCategories())
            .files(fileMetadata)
            .favorites(0)
            .likes(0)
            .views(0) // 추가
            .isContracted(false)
            .build();

        Idea savedIdea = ideaRepository.save(newIdea);

        return IdeaCreateResponse.builder()
            .title(savedIdea.getTitle())
            .userId(savedIdea.getUserId())
            .build();
    }

    public List<Idea> findAllIdea(){
        List<Idea> idea = ideaRepository.findAll();
        return idea;
    }

    public IdeaDetailResponse findIdea(String userId, String ideaId){
        Idea ideaDetail = ideaRepository.findById(ideaId).orElse(null);

        boolean isOwner = (ideaDetail.getUserId().equals(userId));

        IdeaDetailResponse response = IdeaDetailResponse.builder()
                        .ideaId(ideaDetail.getId())
                        .dreamerId(ideaDetail.getUserId())
                        .title(ideaDetail.getTitle())
                        .projectSummary(ideaDetail.getProjectSummary())
                        .teamSummary(ideaDetail.getTeamSummary())
                        .content(ideaDetail.getContent())
                        .categories(ideaDetail.getCategories())
                        .likes(ideaDetail.getLikes())
                        .favorites(ideaDetail.getFavorites())
                        .isContracted(ideaDetail.isContracted())
                        .isOwner(isOwner)
                        .build();
        
        return response;
    }

    public Idea updateLikes(String id, String userId){
        Idea idea = ideaRepository.findById(id).orElse(null);

        List<String> likedUsers = idea.getLikedUsers();

        if(likedUsers.contains(userId)){
            likedUsers.remove(userId);
            idea.setLikes(idea.getLikes()-1);
        }else{
            likedUsers.add(userId);
            idea.setLikes(idea.getLikes()+1);
        }

        idea.setLikedUsers(likedUsers);
        return ideaRepository.save(idea);
    }

    public Idea updateFavorites(String id, String userId){
        Idea idea = ideaRepository.findById(id).orElse(null);

        List<String> favoritedUsers = idea.getFavoritedUsers();

        if(favoritedUsers.contains(userId)){
            favoritedUsers.remove(userId);
            idea.setFavorites(idea.getFavorites() - 1);
        }else{
            favoritedUsers.add(userId);
            idea.setFavorites(idea.getFavorites() + 1);
        }

        idea.setFavoritedUsers(favoritedUsers);
        return ideaRepository.save(idea);
    }

    public boolean deleteIdea(String id){
        try{
            ideaRepository.deleteById(id);
            return true;
        }catch(Exception e){
            return false;
        }        
    }

    public boolean updateIdeaBlockStatus(String id, boolean isBlocked){
        return ideaRepository.findById(id)
            .map(idea -> {
                idea.setBlocked(isBlocked);
                ideaRepository.save(idea);
                return idea.isBlocked();
            })
            .orElse(true);
    }

    // 밑으로 추가
    public Map<String, Long> getIdeasPerField() {
        List<Idea> ideas = ideaRepository.findAll();
        return ideas.stream()
            .flatMap(idea -> idea.getCategories().stream())
            .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));
    }

    public Idea findTopViewedIdea() {
        return ideaRepository.findAll().stream()
            .max((i1, i2) -> Integer.compare(i1.getViews(), i2.getViews()))
            .orElse(null);
    }

    // 추가
    public Idea incrementViewCount(String id) {
        Idea idea = ideaRepository.findById(id).orElseThrow(() -> new RuntimeException("Idea not found"));
        idea.setViews(idea.getViews() + 1);
        return ideaRepository.save(idea);
    }

    // 추가
    public double calculateMatchingRate() {
        List<Idea> allIdeas = ideaRepository.findAll();
        if (allIdeas.isEmpty()) {
            return 0.0;
        }

        long totalIdeas = allIdeas.size();
        long contractedIdeas = allIdeas.stream().filter(Idea::isContracted).count();

        return (double) contractedIdeas / totalIdeas * 100;
    }
}
