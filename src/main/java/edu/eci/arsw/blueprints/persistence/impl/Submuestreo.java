package edu.eci.arsw.blueprints.persistence.impl;

import edu.eci.arsw.blueprints.model.Blueprint;
import edu.eci.arsw.blueprints.model.Point;

import edu.eci.arsw.blueprints.persistence.Filter;

import java.util.ArrayList;

import java.util.List;


import org.springframework.stereotype.Service;

/**
 *
 * @author Juan Sebastian Cepeda Saray
 * @author Santiago Forero Yate
 */
//@Service
public class Submuestreo implements Filter {

    public Submuestreo() {

    }

    @Override
    public List<Point> getPoints(Blueprint pb) {
        // TODO Auto-generated method stub
        List<Point> aux = new ArrayList<>();
        // pb.resetFilter();
        for (int i = 0; i < pb.getPoints().size(); i++) {
            if (i % 2 == 0) {
                aux.add(pb.getPoints().get(i));
            }
        }

        return aux;
    }

}
