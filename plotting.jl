function instantiate_plot(θ, p_θ, E, γ)

    phasespace_position = Node([SVector(0.0, 0.0, 0.0)])
    onany(θ, p_θ, E) do θ_val, p_θ_val, E_val
        phasespace_position[] = [SVector(θ_val, p_θ_val, E_val)]
    end

    physical_position = Node([SVector(0.0, 0.0), SVector(0.0, 0.0)])
    on(θ) do θ_val
        physical_position[] = [SVector(0.0, 0.0), SVector(r(θ_val)...)]
    end

    θ_ax   = range(-1.5π, 1.5π, length = 100)
    p_θ_ax = range(-1.5p_θ₀(2), 1.5p_θ₀(2), length = 100)


    s1 = Scene()
    surface!(s1, θ_ax, p_θ_ax, energy, alpha=0.1, transparency = true)
    surf = s1[end]
    contour3d!(s1, θ_ax, p_θ_ax, energy, levels = [E.val], color=:orange, linewidth=5)
    cont = s1[end]
    map!(E -> [E], cont.attributes.levels, E)
    scatter!(s1, phasespace_position, color=:white, markersize=0.2)
    scat = s1[end]

    s1[Axis].attributes.names.axisnames[] = ("θ", "pθ", "E")
    surf[:colormap] = :RdYlBu
    scale!(s1, 1, 1/2, 1/20)

    s2 = Scene(resolution=(500, 500))
    scatter!(s2, physical_position, limits=FRect(-1.0, -1.0, 2.0, 2.0))
    lines!(s2, physical_position, limits=FRect(-1.0, -1.0, 2.0, 2.0))

    s3, slider_obs = AbstractPlotting.textslider(0.01:0.01:3, "Energía")
    Observables.connect!(slider_obs, γ)

    scene = vbox(s1, hbox(s2,s3))
    display(scene)

    on(scene.events.window_area) do val
        update_cam!(scene.children[1], FRect3D(Vec3f0(0), Vec3f0(1)))
    end

    return scene
end
