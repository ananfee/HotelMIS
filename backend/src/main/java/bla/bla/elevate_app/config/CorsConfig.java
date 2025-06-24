package bla.bla.elevate_app.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import bla.bla.elevate_app.entity.Room;
import bla.bla.elevate_app.env.SettingsApp;

@Configuration
public class CorsConfig implements RepositoryRestConfigurer {
    @Override
	public void configureRepositoryRestConfiguration(
        RepositoryRestConfiguration config,
        CorsRegistry cors) {
	config.exposeIdsFor(Room.class);
    
    cors.addMapping(config.getBasePath() + "/**")
        .allowedOrigins(SettingsApp.getHOST())
        .allowedMethods("GET", "POST", "DELETE", "OPTIONS", "PUT")
        .allowCredentials(true);
	}
}