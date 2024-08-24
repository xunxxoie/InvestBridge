package com.investbridge.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.investbridge.model.db.Idea;
import com.investbridge.model.dto.Http.IdeaRequestDTO;
import com.investbridge.model.dto.Http.IdeaResponseDTO;
import com.investbridge.model.dto.Object.FileMetaData;
import com.investbridge.repository.IdeaRepository;
import com.investbridge.repository.UserRepository;
import com.investbridge.security.JwtTokenProvider;

@Service
@Transactional
public class IdeaService {
    private static final Logger logger = LoggerFactory.getLogger(DashboardUpdateService.class);

    private final IdeaRepository ideaRepository;
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    
    public IdeaService(IdeaRepository ideaRepository, UserRepository userRepository,
            JwtTokenProvider jwtTokenProvider) {
        this.ideaRepository = ideaRepository;
        this.userRepository = userRepository;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public IdeaResponseDTO addIdea(IdeaRequestDTO request){

        // Convert MultipartFile to FileMetaData to save in db
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
            .userName(request.getUserName())
            .title(request.getTitle())
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

        return IdeaResponseDTO.builder()
            .ideaId(savedIdea.getId())
            .userName(savedIdea.getUserName())
            .build();
    }

    public List<Idea> findAllIdea(){
        List<Idea> idea = ideaRepository.findAll();
        return idea;
    }

    public Idea findIdea(String id){
        return ideaRepository.findById(id).orElse(null);
    }

    public Idea updateLikes(String id, String userId){
        Idea idea = ideaRepository.findById(id).orElse(null);

        List<String> likedUsers = idea.getLikedUsers();

        //if user already push likes -> cancel like
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

    public void deleteIdea(String id){
        ideaRepository.deleteById(id);
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
