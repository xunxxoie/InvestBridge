package com.investbridge.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;

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
    private static final long VIEW_INCREMENT_THRESHOLD_SECONDS = 1;

    private final Object lock = new Object();

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

    @Transactional
    public IdeaDetailResponse incrementAndReturnViewCount(String userId, String ideaId) {
        synchronized(lock) {
            Idea idea = ideaRepository.findById(ideaId)
                .orElseThrow(() -> new RuntimeException("Idea not found"));
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime lastViewed = idea.getLastViewed();

        // 마지막 조회 시간으로부터 일정 시간이 지났을 때만 조회수를 증가시킴
        if (lastViewed == null || ChronoUnit.SECONDS.between(lastViewed, now) > VIEW_INCREMENT_THRESHOLD_SECONDS) {
            idea.setViews(idea.getViews() + 1);
            idea.setLastViewed(now);  // 마지막 조회 시간 업데이트
            ideaRepository.save(idea);
        }
            boolean isOwner = idea.getUserId().equals(userId);

            return IdeaDetailResponse.builder()
                .ideaId(idea.getId())
                .dreamerId(idea.getUserId())
                .title(idea.getTitle())
                .projectSummary(idea.getProjectSummary())
                .teamSummary(idea.getTeamSummary())
                .content(idea.getContent())
                .categories(idea.getCategories())
                .likes(idea.getLikes())
                .favorites(idea.getFavorites())
                .views(idea.getViews())
                .isContracted(idea.isContracted())
                .isOwner(isOwner)
                .build();
        }
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

    public List<Idea> getTopIdeasByViews() {
        return ideaRepository.findTop5Ideas();
    }
}
