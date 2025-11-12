package adj.demo.server.controller;

import adj.demo.server.model.User;
import adj.demo.server.model.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@Transactional
@Service
public class UserService {
    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<User> findById(Long id){
        return userRepository.findById(id);
    }

    @Transactional(rollbackFor = {SQLException.class})
    public User save(User user) {
        return userRepository.save(user);
    }

    @Transactional(rollbackFor = {SQLException.class})
    public User update(User user) {
        Optional<User> userOpt = userRepository.findById(user.getId());
        if (userOpt.isPresent()) {
            User userToUpdate = userOpt.get();
            userToUpdate.setName(user.getName());
            userToUpdate.setEmail(user.getEmail());
            userToUpdate.setTel(user.getTel());
            return userRepository.save(userToUpdate);
        }
        return null;
    }
    @Transactional(rollbackFor = {SQLException.class})
    public void delete(Long id) {
        boolean exists = userRepository.existsById(id);

        if (exists) {
            userRepository.deleteById(id);
        } else {throw new RuntimeException("No se encontró el usuario con id: " + id);
    }
    }


}
