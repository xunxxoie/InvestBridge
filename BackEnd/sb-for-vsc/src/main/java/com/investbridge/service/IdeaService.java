package com.investbridge.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.investbridge.model.db.Idea;
import com.investbridge.model.dto.Http.IdeaRequestDTO;
import com.investbridge.model.dto.Http.IdeaResponseDTO;
import com.investbridge.model.dto.Object.FileMetaData;
import com.investbridge.model.dto.Object.IdeaDetailDTO;
import com.investbridge.repository.IdeaRepository;

@Service
@Transactional
public class IdeaService {
    private final IdeaRepository ideaRepository;
    
    public IdeaService(IdeaRepository ideaRepository){
        this.ideaRepository = ideaRepository;
    }

    public IdeaResponseDTO addIdea(IdeaRequestDTO request){

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
            .isContracted(false)
            .build();

        Idea savedIdea = ideaRepository.save(newIdea);

        return IdeaResponseDTO.builder()
            .ideaId(savedIdea.getId())
            .userId(savedIdea.getUserId())
            .build();
    }

    public List<Idea> findAllIdea(){
        List<Idea> idea = ideaRepository.findAll();
        return idea;
    }

    public IdeaDetailDTO findIdea(String userId, String ideaId){
        Idea ideaDetail = ideaRepository.findById(ideaId).orElse(null);

        boolean isOwner = (ideaDetail.getUserId().equals(userId));

        IdeaDetailDTO response = IdeaDetailDTO.builder()
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
}
